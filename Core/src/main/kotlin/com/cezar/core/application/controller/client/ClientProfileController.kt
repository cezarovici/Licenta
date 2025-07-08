package com.cezar.core.application.controller.client

import com.cezar.core.application.dto.client.ClientProfileDTO
import com.cezar.core.application.dto.client.ClientProfileUpdateRequestDTO
import com.cezar.core.application.service.client.ClientProfileService
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/client-profile/{clientId}")
class ClientProfileController(
    private val clientProfileService: ClientProfileService
) {
    /**
     * GET /api/client-profile/
     * Endpoint pentru a obține profilul clientului curent.
     */
    @GetMapping("/")
    fun getCurrentUserProfile(@PathVariable clientId: Long): ResponseEntity<ClientProfileDTO> {
        val profileDto = clientProfileService.getClientProfile(clientId)
        return ResponseEntity.ok(profileDto)
    }

    /**
     * PATCH /api/client-profile/
     * Endpoint pentru a actualiza profilul clientului curent.
     */
    @PatchMapping("/")
    fun updateCurrentUserProfile(
        @PathVariable clientId: Long,
        @RequestBody @Valid request: ClientProfileUpdateRequestDTO
    ): ResponseEntity<ClientProfileDTO> {
        val updatedProfile = clientProfileService.updateClientProfile(clientId, request)
        return ResponseEntity.ok(updatedProfile)
    }

    /**
     * DELETE /api/client-profile/
     * Endpoint pentru a șterge profilul clientului curent.
     */
    @DeleteMapping("/")
    fun deleteCurrentUserProfile( @PathVariable clientId: Long): ResponseEntity<Void> {
        clientProfileService.deleteClientProfile(clientId)
        return ResponseEntity.noContent().build()
    }
}