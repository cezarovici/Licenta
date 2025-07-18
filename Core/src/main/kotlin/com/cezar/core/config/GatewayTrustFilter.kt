package com.cezar.core.config

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.util.AntPathMatcher
import org.springframework.web.filter.OncePerRequestFilter

@Component
class GatewayTrustFilter(
    @Value("\${app.gateway.shared-secret}") private val sharedSecret: String,
    private val configProperties: GatewaySecurityConfigProperties

) : OncePerRequestFilter() {
    private val pathMatcher = AntPathMatcher()

    companion object {
        private const val SECRET_HEADER_NAME = "X-Internal-Secret"

        private val ADDITIONAL_IGNORED_PATHS = listOf(
            "/api/docs",
            "/api/docs/**",
            "/swagger-ui.html",
            "/swagger-ui/**",
            "/v3/api-docs/**"
        )
    }
    override fun shouldNotFilter(request: HttpServletRequest): Boolean {
        val configuredExclusion = configProperties.excludedPaths.any { excludedPath ->
            pathMatcher.match(excludedPath, request.requestURI)
        }

        val isSwaggerOrDocs = ADDITIONAL_IGNORED_PATHS.any { ignoredPath ->
            pathMatcher.match(ignoredPath, request.requestURI)
        }

        return configuredExclusion || isSwaggerOrDocs
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val secretFromHeader = request.getHeader(SECRET_HEADER_NAME)
        val requestURI = request.requestURI

        logger.info("Core Filter - Received request for $requestURI. Checking for secret.")
        if (secretFromHeader == null || secretFromHeader != sharedSecret) {
            logger.info("Core Filter - Access Denied for $requestURI: Invalid or missing secret.")
            response.sendError(HttpStatus.FORBIDDEN.value(), "Access Denied: Untrusted request source")
            return
        }

        val userId = request.getHeader("X-User-Id")
        val rolesHeader = request.getHeader("X-User-Roles")

        logger.info("Headers for $requestURI: User ID: $userId, Roles: $rolesHeader")

        if (userId != null) {
            val authorities = rolesHeader?.split(",")
                ?.filter { it.isNotBlank() }
                ?.map { SimpleGrantedAuthority(it.trim()) }
                ?: emptyList()

            val authentication = UsernamePasswordAuthenticationToken(userId, null, authorities)
            SecurityContextHolder.getContext().authentication = authentication

            logger.info("Authentication set with principal: $userId, roles: $authorities")
        }

        filterChain.doFilter(request, response)
    }
}