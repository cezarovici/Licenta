package com.cezar.core.common

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/user-type")
class UserTypeController(
    private val userTypeRetrievalService: UserTypeRetrievalService
) {
    @GetMapping("/")
    fun getMyUserType(@RequestHeader("X-User-Id") accountId: Long): ResponseEntity<UserTypeDTO> {
        val userType = userTypeRetrievalService.getUserType(accountId)
        return ResponseEntity.ok(userType)
    }
}