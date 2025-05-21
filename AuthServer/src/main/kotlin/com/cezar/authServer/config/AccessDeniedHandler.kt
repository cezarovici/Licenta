package com.cezar.authServer.config

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.web.access.AccessDeniedHandler
import org.springframework.stereotype.Component
import java.time.LocalDateTime

@Component
class CustomAccessDeniedHandler : AccessDeniedHandler {
    override fun handle(
        request: HttpServletRequest,
        response: HttpServletResponse,
        accessDeniedException: AccessDeniedException
    ) {
        val errorResponse = mapOf(
            "timestamp" to LocalDateTime.now().toString(),
            "status" to 403,
            "error" to "Forbidden",
            "message" to "You do not have permission to access this resource.",
            "path" to request.requestURI
        )

        response.contentType = "application/json"
        response.status = HttpServletResponse.SC_FORBIDDEN
        response.writer.write(ObjectMapper().writeValueAsString(errorResponse))
    }
}
