package com.cezar.core.controller

import com.cezar.core.service.UserTypeRetrievalService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/user-type")
class UserTypeController(
    private val userTypeRetrievalService: UserTypeRetrievalService
) {
    /**
     * Endpoint pentru a obține tipul de utilizator pentru account_id-ul curent autentificat.
     * Acest endpoint va fi apelat de frontend.
     * Exemplu de apel: GET /api/user-type/me
     * Returnează: { "userType": "CLIENT" } sau { "userType": "BUSINESS" }
     */
    @GetMapping("/me")
    fun getMyUserType(@RequestHeader("X-User-Id") accountId: Long): ResponseEntity<Map<String, String>> {
        val userType = userTypeRetrievalService.getUserType(accountId)
        return if (userType != null) {
            ResponseEntity.ok(mapOf("userType" to userType))
        } else {
            ResponseEntity.notFound().build()
        }
    }
}