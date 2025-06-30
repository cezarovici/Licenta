package com.cezar.core.application.dto.location

import java.time.DayOfWeek
import java.time.LocalTime

// DTO pentru a trimite un set de ID-uri de facilități
data class UpdateLocationFacilitiesRequest(
    val facilityIds: Set<Long>
)

// DTO pentru o singură intrare de program
data class OperatingHourDTO(
    val dayOfWeek: DayOfWeek, // ex: MONDAY, TUESDAY
    val openTime: LocalTime,  // ex: "09:00"
    val closeTime: LocalTime // ex: "17:00"
)

// DTO pentru a trimite noul program complet
data class UpdateOperatingHoursRequest(
    val hours: Set<OperatingHourDTO>
)

// DTO pentru a returna informații despre o fotografie
data class LocationPhotoDTO(
    val id: Long,
    val url: String,
    val description: String?
)