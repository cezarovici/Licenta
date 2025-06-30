package com.cezar.core.application.dto.location

import com.cezar.core.application.dto.EventSummaryDTO
import com.cezar.core.application.dto.business.*
import com.cezar.core.application.dto.business.BusinessLocationsDTO
import com.cezar.core.application.dto.business.LocationPhotoDTO
import com.cezar.core.application.dto.business.OperatingHourDTO

/**
 * DTO Sumar: Conține informații esențiale pentru afișarea în liste sau pe hartă.
 * Fără colecții, pentru un răspuns rapid și concis.
 */
data class LocationSummaryDTO(
    val id: Long?,
    val name: String,
    val address: String,
    val latitude: Double?,
    val longitude: Double?
)

/**
 * DTO Detaliat: Conține toate informațiile despre o locație.
 * Ideal pentru pagina de detalii a unei locații specifice.
 */
data class LocationDetailDTO(
    val id: Long?,
    val name: String,
    val address: String,
    val latitude: Double?,
    val longitude: Double?,
    val business: BusinessLocationsDTO,
    val photos: Set<LocationPhotoDTO>,
    val operatingHours: Set<OperatingHourDTO>,
    val facilities: Set<FacilityDTO>,
    val upcomingEventsCount: Int
)

/**
 * DTO specializat pentru Evenimente: Afișează locația și evenimentele viitoare asociate.
 */
data class LocationEventsDTO(
    val id: Long?,
    val name: String,
    val address: String,
    val events: Set<EventSummaryDTO> // Folosim DTO-ul sumar pentru evenimente
)


/**
 * DTO pentru crearea unei noi locații.
 * Conține doar datele pe care clientul trebuie să le trimită.
 * Nu conține ID-ul (care va fi generat de server) sau alte DTO-uri complexe.
 */
data class LocationCreateRequestDTO(
    val name: String,
    val address: String,
    val latitude: Double?,
    val longitude: Double?,
    val businessId: Long
)

data class LocationResponse(
    val id: Long,
    val name: String,
    val address: String,
    val latitude: Double?,
    val longitude: Double?,
    val businessId: Long
)

data class LocationUpdateRequest(
    val name: String,
    val address: String,
    val latitude: Double?,
    val longitude: Double?
)