package com.cezar.authServer.dto

import java.time.LocalDateTime

data class ErrorResponseDto(
    val message: String,
    val status: Int,
    val timestamp: LocalDateTime = LocalDateTime.now()
)
