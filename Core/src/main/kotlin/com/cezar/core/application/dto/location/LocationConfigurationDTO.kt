package com.cezar.core.application.dto.location

import com.cezar.core.domain.model.locations.CancellationPolicy
import java.math.BigDecimal
import java.time.LocalTime

// DTO pentru a crea sau actualiza o regulă de preț
data class PricingRuleDTO(
    val id: Long?,
    val ruleName: String,
    val daysOfWeek: Set<String>,
    val startTime: LocalTime?,
    val endTime: LocalTime?,
    val pricePerHour: BigDecimal
)

// DTO pentru a crea sau actualiza o configurație de sport
data class SportConfigurationDTO(
    val id: Long?,
    val sportName: String,
    val surfaceType: String?,
    val recommendedCapacity: String?,
    val minBookingDuration: Int,
    val bookingSlotIncrement: Int
)

// DTO pentru a actualiza regulile generale de rezervare ale unei locații
data class BookingRulesUpdateRequest(
    val maxBookingAdvanceDays: Int,
    val cancellationPolicy: CancellationPolicy
)