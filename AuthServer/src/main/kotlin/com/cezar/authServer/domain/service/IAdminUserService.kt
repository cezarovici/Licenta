package com.cezar.authServer.domain.service

import com.cezar.authServer.dto.UserCreateDto
import com.cezar.authServer.dto.UserDTO
import com.cezar.authServer.dto.UserUpdateDto

interface IAuthUserService {
    fun getUsers(): List<UserDTO>
    fun getUserById(id: Long): UserDTO
    fun createUser(userDTO: UserCreateDto): UserDTO
    fun updateUser(id: Long, userDTO: UserUpdateDto): UserDTO
    fun deleteUser(id: Long)
}