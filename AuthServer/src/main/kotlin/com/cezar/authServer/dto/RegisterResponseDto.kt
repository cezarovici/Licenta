package com.cezar.authServer.dto

data class AuthUserResponseDTO(
    val id: Long,
    val email: String,
    val username: String
)