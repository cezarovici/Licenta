package com.cezar.authServer.dto

import java.util.Date

data class UserDTO(
    val id: Long,
    val username: String,
    val email: String,
    val role: String,
    val createdAt: Date,
    val updatedAt: Date,
    val isEnabled: Boolean,
    val authorities: Set<String>
)
