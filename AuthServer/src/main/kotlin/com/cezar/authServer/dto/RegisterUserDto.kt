package com.cezar.authServer.dto

import jakarta.validation.constraints.*
import lombok.Data
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority

@Data
data class RegisterUserDto(
    @field:NotEmpty(message = "The email address is required.")
    @field:Email(message = "The email address is invalid.", flags = [Pattern.Flag.CASE_INSENSITIVE])
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
) {
    fun getRoles(): Set<GrantedAuthority> =
        authorities.map { SimpleGrantedAuthority("ROLE_$it") }.toSet()
}
