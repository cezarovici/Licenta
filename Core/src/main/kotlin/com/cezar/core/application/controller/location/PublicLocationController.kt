package com.cezar.core.application.controller.location

import com.cezar.core.application.dto.location.LocationDetailDTO
import com.cezar.core.application.dto.location.LocationSummaryDTO
import com.cezar.core.application.dto.location.OperatingHourDTO
import com.cezar.core.application.dto.location.SportConfigurationDTO
import com.cezar.core.application.dto.shared.FacilityDTO
import com.cezar.core.application.service.location.LocationConfigService
import com.cezar.core.application.service.location.LocationQueryService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/locations")
@Tag(name = "Public Location API", description = "Endpoints for public information about locations")
class PublicLocationController(
    private val locationQueryService: LocationQueryService,
    private val locationConfigService: LocationConfigService
) {

    @GetMapping
    @Operation(summary = "Get a summary list of all available locations")
    fun getAllLocations(): ResponseEntity<List<LocationSummaryDTO>> {
        val locations = locationQueryService.getAllLocationsSummary()
        return ResponseEntity.ok(locations)
    }

    /**
     * Returnează detalii complete pentru o locație specifică.
     */
    @GetMapping("/{locationId}")
    @Operation(summary = "Get detailed information for a specific location")
    fun getLocationDetails(@PathVariable locationId: Long): ResponseEntity<LocationDetailDTO> {
        val locationDetails = locationQueryService.getLocationDetails(locationId)
        return ResponseEntity.ok(locationDetails)
    }

    @GetMapping("/{locationId}/business/{businessId}/sport-configurations")
    @Operation(summary = "Get all sport configurations for a specific location")
    fun getSportConfigurations(@PathVariable locationId: Long, @PathVariable businessId: Long): ResponseEntity<Set<SportConfigurationDTO>> {
        val response = locationConfigService.getSportConfiguration(businessId, locationId)
        return ResponseEntity.ok(response)
    }

    @GetMapping("/{locationId}/business/{businessId}/operating-hours")
    fun getOperatingHours(@PathVariable businessId: Long,
                          @PathVariable locationId: Long):ResponseEntity<Set<OperatingHourDTO>>{
        val response = locationConfigService.getOperatingHours(businessId, locationId)
        return ResponseEntity.ok(response)
    }

    @GetMapping("/{locationId}/business/{businessId}/facilities")
    @Operation(summary = "Get all facilities for a specific location")
    fun getFacilities(@PathVariable locationId: Long, @PathVariable businessId: Long): ResponseEntity<Set<FacilityDTO>> {
        val response = locationConfigService.getFacilities(businessId, locationId)
        return ResponseEntity.ok(response)
    }
}