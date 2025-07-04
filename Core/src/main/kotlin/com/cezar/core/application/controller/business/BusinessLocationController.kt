package com.cezar.core.application.controller.business

import com.cezar.core.application.dto.location.*
import com.cezar.core.application.dto.shared.FacilityDTO
import com.cezar.core.application.service.location.LocationManagementService
import com.cezar.core.config.AuthorizeBusinessOwner
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/business-profiles/{businessAccountId}/locations")
@AuthorizeBusinessOwner
class BusinessLocationController(private val locationManagementService: LocationManagementService) {

    @PostMapping
    fun createLocation(
        @PathVariable businessAccountId: Long,
        @RequestBody @Valid request: LocationCreateRequestDTO
    ): ResponseEntity<LocationResponse> {
        val response = locationManagementService.createLocation(businessAccountId, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @GetMapping("/{locationId}")
    fun getLocationById(
        @PathVariable businessAccountId: Long,
        @PathVariable locationId: Long
    ): ResponseEntity<LocationDetailDTO> {
        val response = locationManagementService.getLocationByIdForBusiness(businessAccountId, locationId)
        return ResponseEntity.ok(response)
    }

    @GetMapping
    fun getAllLocationsForBusiness(
        @PathVariable businessAccountId: Long
    ): ResponseEntity<List<LocationResponse>> {
        val response = locationManagementService.getAllLocationsForBusiness(businessAccountId)
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

    @PutMapping("/{locationId}/operating-hours")
    fun updateOperatingHours(
        @PathVariable businessAccountId: Long,
        @PathVariable locationId: Long,
        @RequestBody @Valid request: UpdateOperatingHoursRequest
    ): ResponseEntity<Set<OperatingHourDTO>> {
        val response = locationManagementService.updateOperatingHours(businessAccountId, locationId, request)
        return ResponseEntity.ok(response)
    }

    @PutMapping("/{locationId}/facilities")
    fun updateFacilities(
        @PathVariable businessAccountId: Long,
        @PathVariable locationId: Long,
        @RequestBody @Valid request: UpdateFacilitiesRequest
    ): ResponseEntity<Set<FacilityDTO>> {
        val response = locationManagementService.updateFacilities(businessAccountId, locationId, request)
        return ResponseEntity.ok(response)
    }

    @PostMapping("/{locationId}/photos")
    fun addPhoto(
        @PathVariable businessAccountId: Long,
        @PathVariable locationId: Long,
        @RequestBody @Valid request: PhotoCreateRequest
    ): ResponseEntity<LocationPhotoDTO> {
        val newPhoto = locationManagementService.addPhotoToLocation(businessAccountId, locationId, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(newPhoto)
    }

    @DeleteMapping("/{locationId}/photos/{photoId}")
    fun deletePhoto(
        @PathVariable businessAccountId: Long,
        @PathVariable locationId: Long,
        @PathVariable photoId: Long
    ): ResponseEntity<Void> {
        locationManagementService.deletePhotoFromLocation(businessAccountId, locationId, photoId)
        return ResponseEntity.noContent().build()
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