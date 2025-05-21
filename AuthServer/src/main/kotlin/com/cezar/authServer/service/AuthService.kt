package com.cezar.authServer.service

import com.cezar.authServer.dto.LoginResponseDto
import com.cezar.authServer.dto.LoginUserDto
import com.cezar.authServer.dto.RegisterUserDto
import com.cezar.authServer.entity.UserEntity
import com.cezar.authServer.repository.UserInfoRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import java.util.*

@Service
class AuthService : UserDetailsService{
    @Autowired
    private lateinit var userRepository: UserInfoRepository
    @Autowired
    private lateinit var jwtService: JwtService

    private val passwordEncoder = BCryptPasswordEncoder(12)

    override fun loadUserByUsername(username: String?): UserEntity? {
        return userRepository.findByUsername(username!!)
    }

    fun getUsers(): List<UserEntity> {
        return userRepository.findAll().toList()
    }

    fun signup(input: RegisterUserDto): UserEntity {
        if (userRepository.findByUsername(input.username) != null) {
            throw IllegalStateException("User with username ${input.username} already exists")
        }

        val hashedPassword = passwordEncoder.encode(input.password)
        val roles = input.getRoles()

        val user = UserEntity(
            email = input.email,
            username = input.username,
            password = hashedPassword,
            isEnabled = true,
            isCredentialsNonExpired = true,
            isAccountNonExpired = true,
            isAccountNonLocked = true,
            authorities = roles,
            createdAt = Date(),
            updatedAt = Date()
        )

        return userRepository.save(user)
    }

    fun signin(input: LoginUserDto): LoginResponseDto {
        val user = userRepository.findByUsername(input.username)
            ?: throw IllegalArgumentException("Invalid username or password")

        if (!passwordEncoder.matches(input.password, user.password)) {
            throw IllegalArgumentException("Invalid username or password")
        }

        val token = jwtService.generateToken(user)
        return LoginResponseDto(token)
    }
}