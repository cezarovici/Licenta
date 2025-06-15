package com.cezar.core.controller

import com.cezar.core.dto.location.LocationCreateRequest
import com.cezar.core.dto.location.LocationResponse
import com.cezar.core.dto.location.LocationUpdateRequest
import com.cezar.core.service.LocationService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/business-profiles/{businessAccountId}/locations")
class LocationController(
    private val locationService: LocationService
) {
    /**
     * Creează o nouă locație pentru o afacere.
     * POST /api/business-profiles/{businessAccountId}/locations
     */
    @PostMapping
    fun createLocation(
        @PathVariable businessAccountId: Long,
        @RequestHeader("X-User-Id") authenticatedAccountId: Long, // Pentru verificare de autorizare
        @RequestBody @Valid request: LocationCreateRequest
    ): ResponseEntity<LocationResponse> {
        // Asigură-te că user-ul autentificat este proprietarul afacerii
        if (businessAccountId != authenticatedAccountId) {
            throw org.springframework.web.server.ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You can only manage locations for your own business profile.")
        }
        val response = locationService.createLocation(businessAccountId, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    /**
     * Obține o locație specifică a unei afaceri.
     * GET /api/business-profiles/{businessAccountId}/locations/{locationId}
     */
    @GetMapping("/{locationId}")
    fun getLocationById(
        @PathVariable businessAccountId: Long,
        @PathVariable locationId: Long,
        @RequestHeader("X-User-Id") authenticatedAccountId: Long
    ): ResponseEntity<LocationResponse> {
        if (businessAccountId != authenticatedAccountId) {
            throw org.springframework.web.server.ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You can only view locations for your own business profile.")
        }
        val response = locationService.getLocationById(businessAccountId, locationId)
        return ResponseEntity.ok(response)
    }

    /**
     * Obține toate locațiile unei afaceri.
     * GET /api/business-profiles/{businessAccountId}/locations
     */
    @GetMapping
    fun getAllLocationsForBusiness(
        @PathVariable businessAccountId: Long,
        @RequestHeader("X-User-Id") authenticatedAccountId: Long
    ): ResponseEntity<List<LocationResponse>> {
        if (businessAccountId != authenticatedAccountId) {
            throw org.springframework.web.server.ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You can only view locations for your own business profile.")
        }
        val response = locationService.getAllLocationsForBusiness(businessAccountId)
        return ResponseEntity.ok(response)
    }

    /**
     * Actualizează o locație existentă.
     * PUT /api/business-profiles/{businessAccountId}/locations/{locationId}
     */
    @PutMapping("/{locationId}")
    fun updateLocation(
        @PathVariable businessAccountId: Long,
        @PathVariable locationId: Long,
        @RequestHeader("X-User-Id") authenticatedAccountId: Long,
        @RequestBody @Valid request: LocationUpdateRequest
    ): ResponseEntity<LocationResponse> {
        if (businessAccountId != authenticatedAccountId) {
            throw org.springframework.web.server.ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You can only manage locations for your own business profile.")
        }
        val response = locationService.updateLocation(businessAccountId, locationId, request)
        return ResponseEntity.ok(response)
    }

    /**
     * Șterge o locație.
     * DELETE /api/business-profiles/{businessAccountId}/locations/{locationId}
     */
    @DeleteMapping("/{locationId}")
    fun deleteLocation(
        @PathVariable businessAccountId: Long,
        @PathVariable locationId: Long,
        @RequestHeader("X-User-Id") authenticatedAccountId: Long
    ): ResponseEntity<Void> {
        if (businessAccountId != authenticatedAccountId) {
            throw org.springframework.web.server.ResponseStatusException(HttpStatus.FORBIDDEN, "Access Denied: You can only manage locations for your own business profile.")
        }
        locationService.deleteLocation(businessAccountId, locationId)
        return ResponseEntity.noContent().build() // 204 No Content
    }
}