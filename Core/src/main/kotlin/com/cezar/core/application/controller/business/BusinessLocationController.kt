package com.cezar.core.application.controller.business

import com.cezar.core.application.dto.location.*
import com.cezar.core.application.service.location.LocationService
import com.cezar.core.config.AuthorizeBusinessOwner
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/business-profiles/{businessAccountId}/locations")
@AuthorizeBusinessOwner
class BusinessLocationController(private val locationManagementService: LocationService) {

    @PostMapping
    fun createLocation(
        @PathVariable businessAccountId: Long,
        @RequestBody @Valid request: LocationCreateRequestDTO
    ): ResponseEntity<LocationResponse> {
        val response = locationManagementService.createLocation(businessAccountId, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @PostMapping("/create-complete")
    fun createCompleteLocation(
        @PathVariable businessAccountId: Long,
        @RequestBody @Valid request: CreateCompleteLocationRequestDTO
    ): ResponseEntity<LocationDetailDTO> {
        val response = locationManagementService.createCompleteLocation(businessAccountId, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @GetMapping
    fun getAllLocationsForBusiness(
        @PathVariable businessAccountId: Long
    ): ResponseEntity<List<LocationResponse>> {
        val response = locationManagementService.getAllLocationsForBusiness(businessAccountId)
        return ResponseEntity.ok(response)
    }

    @GetMapping("/{locationId}")
    fun getLocationById(
        @PathVariable businessAccountId: Long,
        @PathVariable locationId: Long
    ): ResponseEntity<LocationDetailDTO> {
        val response = locationManagementService.getLocationByIdForBusiness(businessAccountId, locationId)
        return ResponseEntity.ok(response)
    }

    @PatchMapping("/{locationId}")
    fun updateLocationDetails(
        @PathVariable businessAccountId: Long,
        @PathVariable locationId: Long,
        @RequestBody @Valid request: LocationUpdateRequest
    ): ResponseEntity<LocationResponse> {
        val response = locationManagementService.updateLocation(businessAccountId, locationId, request)
        return ResponseEntity.ok(response)
    }

    @DeleteMapping("/{locationId}")
    fun deleteLocation(
        @PathVariable businessAccountId: Long,
        @PathVariable locationId: Long
    ): ResponseEntity<Void> {
        locationManagementService.deleteLocation(businessAccountId, locationId)
        return ResponseEntity.noContent().build()
    }
}