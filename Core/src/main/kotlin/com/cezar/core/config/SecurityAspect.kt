package com.cezar.core.config

import jakarta.servlet.http.HttpServletRequest
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.annotation.Before
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.server.ResponseStatusException
import org.springframework.web.servlet.HandlerMapping

@Aspect
@Component
class SecurityAspect(private val request: HttpServletRequest) {
    companion object {
        private val logger = LoggerFactory.getLogger(SecurityAspect::class.java)
    }

    @Before("@within(com.cezar.core.config.AuthorizeBusinessOwner) || @annotation(com.cezar.core.config.AuthorizeBusinessOwner)")
    fun checkBusinessOwnership() {
        val authenticatedAccountIdStr = request.getHeader("X-User-Id")
        if (authenticatedAccountIdStr == null) {
            logger.warn("Security check failed: Missing X-User-Id header.")
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing authentication header.")
        }

        val authenticatedAccountId = authenticatedAccountIdStr.toLongOrNull()
        if (authenticatedAccountId == null) {
            logger.warn("Security check failed: Invalid format for X-User-Id header.")
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid user ID format.")
        }

        val pathVariables = request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE) as Map<String, String>
        val businessAccountIdStr = pathVariables["businessAccountId"]
        if (businessAccountIdStr == null) {
            logger.error("Security check misconfiguration: @AuthorizeBusinessOwner used on an endpoint without a {businessAccountId} path variable.")
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Endpoint security misconfiguration.")
        }

        val businessAccountId = businessAccountIdStr.toLong()

        logger.debug("Authorizing request: authenticatedAccountId=$authenticatedAccountId, targetBusinessAccountId=$businessAccountId")

        if (businessAccountId != authenticatedAccountId) {
            logger.warn("Authorization FAILED for user $authenticatedAccountId on business resource $businessAccountId.")
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You do not have permission to access this resource.")
        }

        logger.debug("Authorization successful for user $authenticatedAccountId.")
    }
}