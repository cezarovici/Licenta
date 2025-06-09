package com.cezar.core.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern

data class RegisterRequest(
    @field:Email(message = "The email address is invalid.")
    @field:NotBlank(message = "The email address is required.")
    val email: String,

    @field:Pattern(
        regexp = "^[a-zA-Z0-9]{3,}$",
        message = "Username must be at least 3 characters and contain only letters and digits."
    )
    @field:NotBlank(message = "The username is required.")
    val username: String,

    @field:NotBlank(message = "The password is required.")
    @field:Pattern(
        regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@#\$%^&+=!]).{8,}$",
        message = "Password must be at least 8 characters, include an uppercase letter, a digit and a special character."
    )
    val password: String,

    val authorities: List<String>
)