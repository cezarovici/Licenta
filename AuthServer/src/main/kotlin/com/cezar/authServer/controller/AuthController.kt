package com.cezar.authServer.controller

import com.cezar.authServer.dto.AuthUserResponseDTO
import com.cezar.authServer.dto.LoginUserDto
import com.cezar.authServer.dto.RegisterUserDto
import com.cezar.authServer.entity.UserEntity
import com.cezar.authServer.service.AuthService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/idm/auth")
class AuthController {
    @Autowired
    private lateinit var authUserService: AuthService

    @GetMapping("/welcome")
    private fun welcome(): String {
        return "Welcome"
    }

    @PostMapping("/login")
    fun login(@RequestBody userInfo: LoginUserDto): ResponseEntity<*> {
        val token = authUserService.signin(userInfo)
        return ResponseEntity.ok(token)
    }

    @PostMapping("/signup")
    fun register(@RequestBody registerUserDto: RegisterUserDto): ResponseEntity<AuthUserResponseDTO> {
        val registeredUser: UserEntity = authUserService.signup(registerUserDto)

        val responseDto = AuthUserResponseDTO(
            id = registeredUser.getId(),
            email = registeredUser.getEmail(),
            username = registeredUser.username
        )

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto)
    }
}