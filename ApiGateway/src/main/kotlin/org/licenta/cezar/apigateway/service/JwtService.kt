package org.licenta.cezar.apigateway.service

import io.jsonwebtoken.*
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.security.Key
import java.util.*
import java.util.function.Function

@Service
class JwtService {
    private val logger = LoggerFactory.getLogger(JwtService::class.java)

    @Value("\${app.gateway.shared-secret}")
    private lateinit var secretKey: String

    fun extractUsername(token: String): String {
        logger.debug("Attempting to extract username from token: {}", token.take(20) + "...")
        return extractClaim(token, Claims::getSubject)
    }

    fun extractAccountId(token: String): Long {
        logger.debug("Attempting to extract account ID from token: {}", token.take(20) + "...")
        val accountId = extractClaim(token) { it.get("accountId", Number::class.java) }
        return accountId.toLong()
    }

    fun extractRoles(token: String): List<String> {
        logger.debug("Attempting to extract roles from token: {}", token.take(20) + "...")
        val claims = extractAllClaims(token)
        @Suppress("UNCHECKED_CAST")
        val roles = claims.get("roles")
        return when (roles) {
            is List<*> -> roles.mapNotNull { it?.toString() }
            is String -> roles.split(",").map { it.trim() }.filter { it.isNotBlank() }
            else -> {
                logger.warn("Roles claim not found or is of unexpected type: {}. Returning empty list.", roles?.javaClass?.simpleName)
                emptyList()
            }
        }
    }

    fun isTokenValid(token: String): Boolean {
        logger.info("Starting JWT validation for token: {}", token.take(20) + "...")
        return try {
            // By calling extractAllClaims() here, we ensure signature and structural validity are checked FIRST.
            // If any of these fail, an exception will be thrown and caught below.
            val claims = extractAllClaims(token) // This line will throw if token is invalid, malformed, or has bad signature

            val expirationDate = claims.expiration
            val isExpired = expirationDate.before(Date())
            if (isExpired) {
                logger.warn("JWT is EXPIRED. Expiration time: {}, Current time: {}", expirationDate, Date())
                return false
            }
            logger.info("JWT is VALID and not expired.")
            return true
        } catch (e: ExpiredJwtException) {
            logger.warn("JWT validation failed: Token EXPIRED. Message: {}", e.message)
            false
        } catch (e: SignatureException) {
            logger.warn("JWT validation failed: INVALID SIGNATURE. Message: {}", e.message)
            // Log the key used if possible (careful not to expose sensitive info in production)
            logger.debug("Signature check failed with key: {}", getSignInKey().toString())
            false
        } catch (e: MalformedJwtException) {
            logger.warn("JWT validation failed: MALFORMED TOKEN. Message: {}", e.message)
            false
        } catch (e: IllegalArgumentException) {
            // This might catch issues like missing claims or incorrect base64 decoding of the key
            logger.warn("JWT validation failed: ILLEGAL ARGUMENT. Message: {}", e.message)
            false
        } catch (e: Exception) {
            logger.error("An UNEXPECTED ERROR occurred during JWT validation: {}", e.message, e)
            false
        }
    }

    private fun isTokenExpired(token: String): Boolean {
        // This method is now implicitly called by isTokenValid, and the logic is handled by try-catch.
        // It's still fine to keep it for clarity if extractExpiration is also robust.
        val expiration = extractExpiration(token)
        val expired = expiration.before(Date())
        logger.debug("Token expiration check: Expiration: {}, Current: {}, Expired: {}", expiration, Date(), expired)
        return expired
    }

    private fun extractExpiration(token: String): Date {
        logger.debug("Extracting expiration date from token...")
        return extractClaim(token, Claims::getExpiration)
    }

    fun <T> extractClaim(token: String, claimsResolver: Function<Claims, T>): T {
        logger.debug("Extracting claim using resolver for token: {}", token.take(20) + "...")
        val claims = extractAllClaims(token) // This will trigger JWT parsing errors if any
        return claimsResolver.apply(claims)
    }

    private fun extractAllClaims(token: String): Claims {
        logger.debug("Attempting to parse all claims from token: {}", token.take(20) + "...")
        try {
            val parser = Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
            val claims = parser.parseClaimsJws(token).body
            logger.debug("Successfully parsed JWT claims.")
            return claims
        } catch (e: Exception) {
            // Re-throw to be caught by the more specific handlers in isTokenValid, or log here
            logger.error("Error parsing JWT claims: {}", e.message, e)
            throw e // Re-throw to maintain the exception handling in isTokenValid
        }
    }

    private fun getSignInKey(): Key {
        logger.debug("Generating signing key from secretKey (first 5 chars): {}", secretKey.take(5) + "...")
        try {
            val keyBytes = Decoders.BASE64.decode(secretKey)
            if (keyBytes.isEmpty()) {
                logger.error("Secret key bytes are empty after Base64 decoding. Check 'app.gateway.shared-secret' value.")
                throw IllegalArgumentException("Empty signing key after decoding.")
            }
            val key = Keys.hmacShaKeyFor(keyBytes)
            logger.debug("Signing key generated successfully.")
            return key
        } catch (e: Exception) {
            logger.error("Failed to decode secret key or generate signing key: {}", e.message, e)
            throw e // Propagate the error
        }
    }
}