package com.cezar.core.application.dto.location

import com.cezar.core.application.dto.business.BusinessLocationsDTO
import com.cezar.core.application.dto.shared.FacilityDTO
import com.cezar.core.domain.model.locations.CancellationPolicy


data class LocationDetailDTO(
    val id: Long,
    val name: String,
    val address: String,
    val latitude: Double?,
    val longitude: Double?,
    val business: BusinessLocationsDTO,
    val photos: Set<LocationPhotoDTO>,
    val operatingHours: Set<OperatingHourDTO>,
    val facilities: Set<FacilityDTO>,
    val upcomingEventsCount: Int,

    val pricingRules: Set<PricingRuleDTO>,
    val sportConfigurations: Set<SportConfigurationDTO>,
    val bookingRules: BookingRulesInfoDTO
)

data class BookingRulesInfoDTO(
    val maxBookingAdvanceDays: Int?,
    val cancellationPolicy: CancellationPolicy
)