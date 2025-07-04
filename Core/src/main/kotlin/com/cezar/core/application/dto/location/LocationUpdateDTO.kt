package com.cezar.core.application.dto.location

import java.time.LocalTime

/**
 * DTO pentru actualizarea parțială (PATCH) a detaliilor de bază ale unei locații.
 * Toate câmpurile sunt opționale.
 */
data class LocationUpdateRequest(
    val name: String?,
    val address: String?,
    val latitude: Double?,
    val longitude: Double?
)

/**
 * DTO pentru crearea unei noi fotografii asociate unei locații.
 */
data class PhotoCreateRequest(
    val url: String,
    val description: String?
)

/**
 * DTO pentru răspunsul la crearea/citirea unei fotografii.
 */
data class LocationPhotoDTO(
    val id: Long,
    val photoUrl: String,
    val description: String?,
    val isPrimary: Boolean = false // Poate fi extins ulterior
)

/**
 * DTO pentru reprezentarea programului de operare.
 */
data class OperatingHourDTO (
    val dayOfWeek: String,
    val openTime: LocalTime,
    val closeTime: LocalTime
)

/**
 * DTO pentru a trimite noul program complet (strategia "clear and replace").
 */
data class UpdateOperatingHoursRequest(
    val hours: Set<OperatingHourDTO>
)

/**
 * DTO pentru a trimite noul set de ID-uri de facilități (strategia "clear and replace").
 */
data class UpdateFacilitiesRequest(
    val facilityIds: Set<Long>
)