package com.cezar.core.application.dto.location

import com.cezar.core.domain.model.locations.CancellationPolicy
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank

/**
 * DTO pentru crearea unei locații cu toate informațiile de la bun început.
 */
data class CreateCompleteLocationRequestDTO(
    @field:NotBlank(message = "Numele locației este obligatoriu")
    val name: String,

    @field:NotBlank(message = "Adresa este obligatorie")
    val address: String,

    val latitude: Double?,
    val longitude: Double?,

    @field:Valid
    val photos: Set<PhotoCreateRequest>? = emptySet(),

    @field:Valid
    val operatingHours: Set<OperatingHourDTO>? = emptySet(),

    val facilityIds: Set<Long>? = emptySet(),

    @field:Valid
    val pricingRules: Set<PricingRuleDTO>? = emptySet(),

    @field:Valid
    val sportConfigurations: Set<SportConfigurationDTO>? = emptySet(),

    @field:Valid
    val bookingRules: BookingRulesUpdateRequest?
)