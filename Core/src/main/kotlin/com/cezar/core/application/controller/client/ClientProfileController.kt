package com.cezar.core.application.controller.client

import com.cezar.core.application.dto.client.ClientProfileDTO
import com.cezar.core.application.service.client.ClientProfileService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/client-profile")
class ClientProfileController(
    private val clientProfileService: ClientProfileService
) {
    /**
     * Endpoint pentru a obține profilul unui client după ID-ul contului său.
     * Exemplu de apel: GET /api/profiles/me
     */
    @GetMapping("/")
    fun getCurrentUserProfile(@RequestHeader("X-User-Id") accountId: Long): ResponseEntity<ClientProfileDTO> {
        val profileDto = clientProfileService.getClientProfile(accountId)
        return ResponseEntity.ok(profileDto)
    }
}