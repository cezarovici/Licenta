package com.cezar.authServer.service

import com.cezar.authServer.dto.UserCreateDto
import com.cezar.authServer.dto.UserDTO
import com.cezar.authServer.dto.UserUpdateDto
import com.cezar.authServer.entity.UserEntity
import com.cezar.authServer.repository.UserInfoRepository
import com.cezar.authServer.domain.service.IAuthUserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import java.util.*

@Service
class AdminUserService : IAuthUserService {
    @Autowired
    private lateinit var userRepository: UserInfoRepository
    private val passwordEncoder = BCryptPasswordEncoder(12)

    override fun getUsers(): List<UserDTO> {
        return userRepository.findAll().map { it.toDTO() }
    }

    override fun getUserById(id: Long): UserDTO =
        userRepository.findById(id)
            .orElseThrow { NoSuchElementException("User with ID $id not found") }
            .toDTO()

    override fun createUser(userDTO: UserCreateDto): UserDTO {
        if (userRepository.findByUsername(userDTO.username) != null) {
            throw IllegalStateException("Username already exists")
        }

        val user = UserEntity(
            email = userDTO.email,
            username = userDTO.username,
            password = passwordEncoder.encode(userDTO.password),
            authorities = setOf(), // sau default role
            isEnabled = true,
            isCredentialsNonExpired = true,
            isAccountNonExpired = true,
            isAccountNonLocked = true,
            createdAt = Date(),
            updatedAt = Date()
        )

        return userRepository.save(user).toDTO()
    }

    override fun updateUser(id: Long, userDTO: UserUpdateDto): UserDTO {
        val user = userRepository.findById(id).orElseThrow { Exception("User not found") }

        val updatedUser = user.copy(
            username = userDTO.username,
            email = userDTO.email,
            updatedAt = Date()
        )

        return userRepository.save(updatedUser).toDTO()
    }

    override fun deleteUser(id: Long) {
        if (!userRepository.existsById(id)) throw Exception("User not found")
        userRepository.deleteById(id)
    }
}
