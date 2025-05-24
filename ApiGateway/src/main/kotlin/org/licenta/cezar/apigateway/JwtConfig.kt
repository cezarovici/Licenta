package org.licenta.cezar.apigateway

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.JwtException
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.Ordered
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.GlobalFilter
import reactor.core.publisher.Mono

@Component
class JwtAuthenticationFilter : GlobalFilter, Ordered {
    @Value("\${security.jwt.secret-key}")
    private val secretKey: String? = null

    override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
        val request = exchange.request
        val authHeader = request.headers.getFirst(HttpHeaders.AUTHORIZATION)

        if (authHeader.isNullOrBlank() || !authHeader.startsWith("Bearer ")) {
            exchange.response.statusCode = HttpStatus.UNAUTHORIZED
            return exchange.response.setComplete()
        }

        val token = authHeader.removePrefix("Bearer ").trim()

        return try {
            val claims: Claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .body

            val userId = claims.subject
            val roles = claims["role"]?.toString() ?: "UNKNOWN"

            val modifiedRequest = request.mutate()
                .header("X-User-Id", userId)
                .header("X-User-Roles", roles)
                .build()

            val modifiedExchange = exchange.mutate().request(modifiedRequest).build()
            chain.filter(modifiedExchange)

        } catch (ex: JwtException) {
            exchange.response.statusCode = HttpStatus.UNAUTHORIZED
            exchange.response.setComplete()
        }
    }

    override fun getOrder(): Int = -1
}
