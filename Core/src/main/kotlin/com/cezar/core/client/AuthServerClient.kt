package com.cezar.core.client

import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody

data class CreateAuthUserRequest(
    val email: String,
    val username: String,
    val password: String,
    val authorities: Set<String>
)

data class AuthUserDTO(
    val id: Long,
    val email: String,
    val username: String
)

@FeignClient(name = "auth-server", url="http://auth-server:8081", path = "/idm")
interface AuthServerClient {
    @PostMapping("/auth/signup")
    fun createUser(@RequestBody request: CreateAuthUserRequest): AuthUserDTO

    @DeleteMapping("/auth/signup{id}")
    fun deleteUser(@PathVariable("id") id: Long)
}