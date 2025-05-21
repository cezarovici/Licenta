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

    @field:NotBlank(message = "The username is required.")
    val username: String,

    @field:NotBlank(message = "The password is required.")
    val password: String,

    val authorities: List<String>
) {
    fun getRoles(): Set<GrantedAuthority> =
        authorities.map { SimpleGrantedAuthority("ROLE_$it") }.toSet()
}
