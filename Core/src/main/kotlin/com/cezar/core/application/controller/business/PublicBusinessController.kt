package com.cezar.core.application.controller.business

import com.cezar.core.application.dto.business.BusinessDTO
import com.cezar.core.application.dto.business.BusinessLocationsDTO
import com.cezar.core.application.dto.business.BusinessSummaryDTO
import com.cezar.core.application.dto.location.LocationDetailDTO
import com.cezar.core.application.dto.location.LocationPhotoDTO
import com.cezar.core.application.dto.location.LocationResponse
import com.cezar.core.application.service.business.BusinessQueryService
import com.cezar.core.application.service.location.LocationPhotoService
import com.cezar.core.application.service.location.LocationService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/businesses")
@Tag(name = "Public Business API", description = "Endpoints for public information about businesses and their locations")
class PublicBusinessController(
    private val businessQueryService: BusinessQueryService,
    private val locationService: LocationService,
    private val locationManagementService: LocationPhotoService
) {
    @GetMapping
    @Operation(summary = "Get a summary list of all businesses")
    fun searchBusinesses(): ResponseEntity<List<BusinessSummaryDTO>> {
        val businesses = businessQueryService.getAllBusinessesSummary()
        return ResponseEntity.ok(businesses)
    }

    @GetMapping("/{businessId}")
    @Operation(summary = "Get detailed information for a specific business by its ID")
    fun getBusinessById(@PathVariable businessId: Long): ResponseEntity<BusinessDTO> {
        val business = businessQueryService.getBusinessDetails(businessId)
        return ResponseEntity.ok(business)
    }

    @GetMapping("/{businessId}/locations")
    @Operation(summary = "Get all locations for a specific business")
    fun getAllLocationsForBusiness(
        @PathVariable businessId: Long
    ): ResponseEntity<List<LocationResponse>> {
        val response = locationService.getAllLocationsForBusiness(businessId)
        return ResponseEntity.ok(response)
    }

    @GetMapping("/{businessId}/locations/{locationId}")
    @Operation(summary = "Get details for a specific location belonging to a business")
    fun getLocationById(
        @PathVariable businessId: Long,
        @PathVariable locationId: Long
    ): ResponseEntity<LocationDetailDTO> {
        val response = locationService.getLocationByIdForBusiness(businessId, locationId)
        return ResponseEntity.ok(response)
    }

    @GetMapping("/{businessAccountId}/photos")
    fun getAllBusinessPhotos(@PathVariable businessAccountId: Long): ResponseEntity<List<LocationPhotoDTO>> {
        val photos = locationManagementService.getAllPhotosForBusiness(businessAccountId)
        return ResponseEntity.ok(photos)
    }


    @GetMapping("/locations")
    @Operation(summary = "Get all locations for the current business")
    fun getMyBusinessLocations(): ResponseEntity<BusinessLocationsDTO> {
        val accountId = getCurrentAccountId()
        val locationsDto = businessQueryService.getBusinessLocations(accountId)
        return ResponseEntity.ok(locationsDto)
    }

    private fun getCurrentAccountId(): Long {
        return SecurityContextHolder.getContext().authentication.name.toLong()
    }
}