package com.cezar.core.application.controller.business

import com.cezar.core.application.dto.location.*
import com.cezar.core.application.service.location.LocationManagementService
import com.cezar.core.config.AuthorizeBusinessOwner
import com.cezar.core.config.CurrentBusinessId
import com.cezar.core.config.CurrentBusinessIdResolver
import jakarta.validation.Valid
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig : WebMvcConfigurer {
    override fun addArgumentResolvers(resolvers: MutableList<HandlerMethodArgumentResolver>) {
        resolvers.add(CurrentBusinessIdResolver())
    }
}

@RestController
@RequestMapping("/api/business-profiles/locations")
@AuthorizeBusinessOwner
class BusinessLocationController(
    private val locationManagementService: LocationManagementService
) {
    @PostMapping
    fun createLocation(
        @CurrentBusinessId businessAccountId: Long,
        @RequestBody @Valid request: LocationCreateRequestDTO
    ): ResponseEntity<LocationResponse> {
        val response = locationManagementService.createLocation(businessAccountId, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(response)
    }

    @GetMapping("/{locationId}")
    fun getLocationById(
        @CurrentBusinessId businessAccountId: Long,
        @PathVariable locationId: Long
    ): ResponseEntity<LocationResponse> {
        val response = locationManagementService.getLocationByIdForBusiness(businessAccountId, locationId)
        return ResponseEntity.ok(response)
    }

    @GetMapping
    fun getAllLocationsForBusiness(
        @CurrentBusinessId businessAccountId: Long,
    ): ResponseEntity<List<LocationResponse>> {
        val response = locationManagementService.getAllLocationsForBusiness(businessAccountId)
        return ResponseEntity.ok(response)
    }

    @PutMapping("/{locationId}")
    fun updateLocation(
        @CurrentBusinessId businessAccountId: Long,
        @PathVariable locationId: Long,
        @RequestBody @Valid request: LocationUpdateRequest
    ): ResponseEntity<LocationResponse> {
        val response = locationManagementService.updateLocation(businessAccountId, locationId, request)
        return ResponseEntity.ok(response)
    }

    @DeleteMapping("/{locationId}")
    fun deleteLocation(
        @CurrentBusinessId businessAccountId: Long,
        @PathVariable locationId: Long
    ): ResponseEntity<Void> {
        locationManagementService.deleteLocation(businessAccountId, locationId)
        return ResponseEntity.noContent().build()
    }
}
