package com.cezar.authServer.controller

import com.cezar.authServer.dto.UserDTO
import com.cezar.authServer.dto.UserUpdateDto
import com.cezar.authServer.domain.service.IAuthUserService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/idm/admin")
class AdminController(
    private val adminService: IAuthUserService
) {
    @GetMapping("/users")
    fun listAllUsers(): List<UserDTO> = adminService.getUsers()

    @GetMapping("/users/{id}")
    fun getUserById(@PathVariable id: Long): UserDTO = adminService.getUserById(id)

    @PutMapping("/users/{id}")
    fun updateUser(@PathVariable id: Long, @RequestBody dto: UserUpdateDto): UserDTO {
        return adminService.updateUser(id, dto)
    }

    @DeleteMapping("/users/{id}")
    fun deleteUser(@PathVariable id: Long) {
        adminService.deleteUser(id)
    }
}