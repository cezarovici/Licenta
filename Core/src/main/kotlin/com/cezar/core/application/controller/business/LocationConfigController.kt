package com.cezar.core.application.controller.business

import com.cezar.core.application.dto.location.*
import com.cezar.core.application.dto.shared.FacilityDTO
import com.cezar.core.application.service.location.LocationConfigService
import com.cezar.core.config.AuthorizeBusinessOwner
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/business-profiles/{businessAccountId}/locations/{locationId}/config")
@AuthorizeBusinessOwner
class LocationConfigController(private val locationManagementService: LocationConfigService) {

    // --- Program ---
    @PutMapping("/operating-hours")
    fun updateOperatingHours(
        @PathVariable businessAccountId: Long,
        @PathVariable locationId: Long,
        @RequestBody @Valid request: UpdateOperatingHoursRequest
    ): ResponseEntity<Set<OperatingHourDTO>> {
        val response = locationManagementService.updateOperatingHours(businessAccountId, locationId, request)
        return ResponseEntity.ok(response)
    }

    // --- Facilități ---
    @PutMapping("/facilities")
    fun updateFacilities(
        @PathVariable businessAccountId: Long,
        @PathVariable locationId: Long,
        @RequestBody @Valid request: UpdateFacilitiesRequest
    ): ResponseEntity<Set<FacilityDTO>> {
        val response = locationManagementService.updateFacilities(businessAccountId, locationId, request)
        return ResponseEntity.ok(response)
    }

    // --- Reguli de Preț ---
    @PostMapping("/pricing-rules")
    fun addPricingRule(@PathVariable businessAccountId: Long, @PathVariable locationId: Long, @RequestBody @Valid dto: PricingRuleDTO): ResponseEntity<PricingRuleDTO> {
        val newRule = locationManagementService.addPricingRule(businessAccountId, locationId, dto)
        return ResponseEntity.status(HttpStatus.CREATED).body(newRule)
    }

    @DeleteMapping("/pricing-rules/{ruleId}")
    fun deletePricingRule(@PathVariable businessAccountId: Long, @PathVariable locationId: Long, @PathVariable ruleId: Long): ResponseEntity<Void> {
        locationManagementService.deletePricingRule(businessAccountId, locationId, ruleId)
        return ResponseEntity.noContent().build()
    }

    // --- Configurații Sportive ---
    @PostMapping("/sport-configurations")
    fun addSportConfiguration(@PathVariable businessAccountId: Long, @PathVariable locationId: Long, @RequestBody @Valid dto: SportConfigurationDTO): ResponseEntity<SportConfigurationDTO> {
        val newConfig = locationManagementService.addSportConfiguration(businessAccountId, locationId, dto)
        return ResponseEntity.status(HttpStatus.CREATED).body(newConfig)
    }

    @DeleteMapping("/sport-configurations/{configId}")
    fun deleteSportConfiguration(@PathVariable businessAccountId: Long, @PathVariable locationId: Long, @PathVariable configId: Long): ResponseEntity<Void> {
        locationManagementService.deleteSportConfiguration(businessAccountId, locationId, configId)
        return ResponseEntity.noContent().build()
    }

    // --- Reguli de Rezervare ---
    @PutMapping("/booking-rules")
    fun updateBookingRules(
        @PathVariable businessAccountId: Long,
        @PathVariable locationId: Long,
        @RequestBody @Valid request: BookingRulesUpdateRequest
    ): ResponseEntity<LocationDetailDTO> {
        val updatedLocation = locationManagementService.updateBookingRules(businessAccountId, locationId, request)
        return ResponseEntity.ok(updatedLocation)
    }
}