package com.cezar.authServer.service

import com.cezar.authServer.dto.LoginResponseDto
import com.cezar.authServer.dto.LoginUserDto
import com.cezar.authServer.dto.RegisterUserDto
import com.cezar.authServer.entity.UserEntity
import com.cezar.authServer.repository.UserInfoRepository
import org.apache.http.auth.InvalidCredentialsException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.util.*

@Service
class AuthService : UserDetailsService {
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
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Username ${input.username} already exists")
        }
        if (userRepository.findByEmail(input.email) != null) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Email ${input.email} already exists")
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
            ?: throw InvalidCredentialsException("Invalid username")

        if (!passwordEncoder.matches(input.password, user.password)) {
            throw InvalidCredentialsException("Invalid password")
        }

        val token = jwtService.generateToken(user)
        return LoginResponseDto(token)
    }


    /**
     * Șterge un utilizator din baza de date pe baza ID-ului său.
     * Folosit pentru operațiuni de compensare.
     * @param userId ID-ul utilizatorului de șters.
     * @throws ResponseStatusException cu HttpStatus.NOT_FOUND dacă utilizatorul nu este găsit.
     */
    @Transactional // Asigură că operația este atomică
    fun deleteUserById(userId: Long) {
        // Verificăm dacă utilizatorul există înainte de a încerca să-l ștergem
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId)
        } else {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "User with ID $userId not found for deletion.")
        }
    }
}