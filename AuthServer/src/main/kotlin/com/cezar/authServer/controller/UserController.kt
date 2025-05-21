package com.cezar.authServer.controller

import com.cezar.authServer.domain.service.IAuthUserService
import com.cezar.authServer.dto.UserDTO
import com.cezar.authServer.dto.UserUpdateDto
import com.cezar.authServer.entity.UserEntity
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/idm/user")
class UserController {
    @Autowired
    private lateinit var authUserService: IAuthUserService

    @GetMapping("/me")
    fun getProfile(@AuthenticationPrincipal user: UserEntity): UserDTO {
        return user.toDTO()
    }

    @PutMapping("/me")
    fun updateProfile(
        @AuthenticationPrincipal user: UserEntity,
        @RequestBody dto: UserUpdateDto
    ): UserDTO {
        return authUserService.updateUser(user.getId(), dto)
    }

    @DeleteMapping("/me")
    fun deleteProfile(@AuthenticationPrincipal user: UserEntity) {
        authUserService.deleteUser(user.getId())
    }
}