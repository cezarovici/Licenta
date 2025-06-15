package org.licenta.cezar.apigateway

import org.slf4j.LoggerFactory
import org.licenta.cezar.apigateway.service.JwtService
import org.springframework.beans.factory.annotation.Value
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.GlobalFilter
import org.springframework.core.Ordered
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

@Component
class AuthenticationFilter(
    private val jwtService: JwtService,
    @Value("\${app.gateway.shared-secret}") private val sharedSecret: String
) : GlobalFilter, Ordered {
    private val logger = LoggerFactory.getLogger(AuthenticationFilter::class.java)

    companion object {
        private const val X_USER_ID_HEADER = "X-User-Id"
        private const val X_USER_ROLES_HEADER = "X-User-Roles"
        private const val X_INTERNAL_SECRET_HEADER = "X-Internal-Secret"
    }

    override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
        val request = exchange.request
        val path = request.uri.path

        logger.debug("Request Headers: {}", request.headers)

        // Public endpoints check
        if (isPublicEndpoint(path)) {
            logger.info("🟢 [Public Access] Bypassing auth for $path")

            return chain.filter(exchange).doOnSuccess {
                logger.info("✅ [Public Request Completed] $path")
            }
        }

        val authHeader = request.headers.getFirst(HttpHeaders.AUTHORIZATION)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("🔴 [Auth Error] Missing or invalid Authorization header")
            logger.debug("Received headers: {}", request.headers)
            return respondWith(exchange, HttpStatus.UNAUTHORIZED, "Authorization header is missing or invalid")
        }

        val token = authHeader.substringAfter("Bearer ")
        logger.debug("Extracted JWT (first/last 5 chars): ${token.take(5)}...${token.takeLast(5)}")

        try {   
            if (!jwtService.isTokenValid(token)) {
                logger.warn("🔴 [Invalid Token] Validation failed for $path")
                return respondWith(exchange, HttpStatus.UNAUTHORIZED, "JWT Token is invalid or expired")
            }

            val roles = jwtService.extractRoles(token)
            logger.debug("User roles: {}", roles)

            if (!hasRequiredRole(path, roles)) {
                logger.warn("⛔ [Forbidden] Path $path requires roles: $roles")
                return respondWith(exchange, HttpStatus.FORBIDDEN, "User does not have required permissions")
            }

            val accountId = jwtService.extractAccountId(token)
            logger.info("🆔 Authenticated User ID: $accountId")

            val modifiedRequest = request.mutate().apply {
                header(X_USER_ID_HEADER, accountId.toString())
                header(X_USER_ROLES_HEADER, roles.joinToString(","))
                header(X_INTERNAL_SECRET_HEADER, sharedSecret) // <-- ADAUGĂ ACEASTĂ LINIE!
                logger.debug("Added headers: $X_USER_ID_HEADER, $X_USER_ROLES_HEADER, $X_INTERNAL_SECRET_HEADER")
            }.build()

            logger.info("🟢 [Auth Success] Proceeding to $path")
            return chain.filter(exchange.mutate().request(modifiedRequest).build())
                .doOnSuccess { logger.info("✅ [Request Completed] $path") }
                .doOnError { logger.error("❌ [Request Failed] $path - ${it.message}") }

        } catch (e: Exception) {
            logger.error("🔥 [Auth Exception] ${e.javaClass.simpleName}: ${e.message}")
            logger.debug("Stack trace:", e)
            return respondWith(exchange, HttpStatus.UNAUTHORIZED, "Error processing token")
        }
    }

    private fun isPublicEndpoint(path: String): Boolean {
        val publicEndpoints = setOf(
            "/api/register/client",
            "/api/register/business",
            "/idm/auth/login"
        )
        val isPublic = publicEndpoints.any { path.startsWith(it) }
        logger.debug("Verificare endpoint public pentru $path: $isPublic")
        return isPublic
    }

    private fun hasRequiredRole(path: String, roles: List<String>): Boolean {
        val requiresAdmin = path.startsWith("/api/admin/")
        val requiresUser = path.startsWith("/api/user/")
        val requiresManager = path.startsWith("/api/manager/")

        var hasAccess = true

        if (requiresAdmin && !roles.contains("ROLE_ADMIN")) {
            hasAccess = false
        }
        if (requiresUser && !roles.contains("ROLE_USER") && !roles.contains("ROLE_ADMIN")) {
            hasAccess = false
        }
        if (requiresManager && !roles.contains("ROLE_MANAGER") && !roles.contains("ROLE_ADMIN")) {
            hasAccess = false
        }

        logger.debug("""
            Role check for path: $path
            - Requires Admin: $requiresAdmin (User has ROLE_ADMIN: ${roles.contains("ROLE_ADMIN")})
            - User roles: $roles
            - Access granted: $hasAccess
        """.trimIndent())

        return hasAccess
    }


    private fun respondWith(exchange: ServerWebExchange, status: HttpStatus, message: String): Mono<Void> {
        logger.info("⚡ [Response] Status $status - $message")
        exchange.response.statusCode = status
        // Poți adăuga un corp de răspuns pentru a da mai multe detalii clientului
        // exchange.response.headers.add(HttpHeaders.CONTENT_TYPE, "application/json")
        // val dataBufferFactory = exchange.response.bufferFactory()
        // val jsonBody = "{\"status\": ${status.value()}, \"message\": \"$message\"}"
        // val buffer = dataBufferFactory.wrap(jsonBody.toByteArray(Charsets.UTF_8))
        // return exchange.response.writeWith(Mono.just(buffer)).then()
        return exchange.response.setComplete()
    }

    override fun getOrder(): Int = -1 // Asigură-te că acest filtru se execută devreme în lanț
}