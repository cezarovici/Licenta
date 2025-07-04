package com.cezar.core.application.dto.location

import com.cezar.core.application.dto.EventSummaryDTO
import com.cezar.core.application.dto.business.*
import com.cezar.core.application.dto.shared.FacilityDTO
import com.cezar.core.domain.model.business.BusinessEntity
import com.cezar.core.domain.model.locations.LocationPhotos


/** DTO specializat pentru Evenimente: Afișează locația și evenimentele viitoare asociate. */
data class LocationEventsDTO(
        val id: Long?,
        val name: String,
        val address: String,
        val events: Set<EventSummaryDTO> // Folosim DTO-ul sumar pentru evenimente
)

/**
 * DTO pentru crearea unei noi locații. Conține doar datele pe care clientul trebuie să le trimită.
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

