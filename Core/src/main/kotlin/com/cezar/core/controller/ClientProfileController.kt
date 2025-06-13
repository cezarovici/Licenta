package com.cezar.core.controller

import com.cezar.core.dto.ClientProfileDTO
import com.cezar.core.service.ClientProfileService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/profiles")
class ClientProfileController(
    private val clientProfileService: ClientProfileService
) {
    /**
     * Endpoint pentru a obține profilul unui client după ID-ul contului său.
     * Exemplu de apel: GET /api/profiles/me
     */
    @GetMapping("/me")
    fun getCurrentUserProfile(@RequestHeader("X-User-Id") accountId: Long): ResponseEntity<ClientProfileDTO> {
        val profileDto = clientProfileService.getClientProfile(accountId)
        return ResponseEntity.ok(profileDto)
    }
}