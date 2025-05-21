package com.cezar.authServer.dto

data class UserCreateDto(
    val email: String,
    val username: String,
    val password: String
)