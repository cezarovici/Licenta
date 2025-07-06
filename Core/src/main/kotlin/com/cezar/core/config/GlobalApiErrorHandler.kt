package com.cezar.core.config

import org.slf4j.LoggerFactory
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.server.ResponseStatusException

@ControllerAdvice
class GlobalApiErrorHandler {

    private val logger = LoggerFactory.getLogger(GlobalApiErrorHandler::class.java)

    data class ErrorResponse(val status: Int, val message: String?)

    /**
     * Gestionează excepțiile de business controlate (ex: 400, 404).
     * Acestea sunt excepțiile pe care le aruncăm noi explicit din service.
     */
    @ExceptionHandler(ResponseStatusException::class)
    fun handleResponseStatusException(ex: ResponseStatusException): ResponseEntity<ErrorResponse> {
        val errorResponse = ErrorResponse(ex.statusCode.value(), ex.reason)
        logger.warn("Handled business exception: Status ${ex.statusCode.value()}, Reason: ${ex.reason}, Message: ${ex.message}")
        return ResponseEntity(errorResponse, ex.statusCode)
    }

    /**
     * Gestionează ORICE altă excepție neașteptată (ex: NullPointerException, etc.).
     * Acesta este un "catch-all" pentru a preveni trimiterea de erori 500 cu detalii interne.
     */
    @ExceptionHandler(Exception::class)
    fun handleGenericException(ex: Exception): ResponseEntity<ErrorResponse> {
        logger.error("An unhandled exception occurred", ex)

        val errorResponse = ErrorResponse(500, "An unexpected internal error occurred. Please contact support.")
        return ResponseEntity.status(500).body(errorResponse)
    }
}