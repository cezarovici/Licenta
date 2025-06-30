package com.cezar.core.application.service.location // Sau un pachet de mappers

import com.cezar.core.application.dto.location.LocationDetailDTO
import com.cezar.core.application.dto.location.LocationEventsDTO
import com.cezar.core.application.dto.location.LocationResponse
import com.cezar.core.application.dto.location.LocationSummaryDTO
import com.cezar.core.domain.model.locations.LocationEntity
// Importă toate DTO-urile și funcțiile .toDTO() necesare de la alte entități
import java.time.LocalDateTime

fun LocationEntity.toSummaryDTO(): LocationSummaryDTO {
    return LocationSummaryDTO(
        id = this.id,
        name = this.name,
        address = this.address,
        latitude = this.latitude,
        longitude = this.longitude
    )
}

fun LocationEntity.toDetailDTO(): LocationDetailDTO {
    return LocationDetailDTO(
        id = this.id,
        name = this.name,
        address = this.address,
        latitude = this.latitude,
        longitude = this.longitude,
        business = this.business.toLocationsDTO(), // Presupune că BusinessEntity are .toLocationsDTO()
        photos = this.photos.map { it.toDTO() }.toSet(),
        operatingHours = this.operatingHours.map { it.toDTO() }.toSet(),
        facilities = this.facilities.map { it.toDTO() }.toSet(),
        upcomingEventsCount = this.events.count { it.eventDateTime.isAfter(LocalDateTime.now()) }
    )
}

fun LocationEntity.toEventsDTO(): LocationEventsDTO {
    return LocationEventsDTO(
        id = this.id,
        name = this.name,
        address = this.address,
        events = this.events
            .filter { it.eventDateTime.isAfter(LocalDateTime.now()) }
            .map { it.toSummaryDTO() } // Presupune că EventEntity are .toSummaryDTO()
            .toSet()
    )
}

// Aceasta este funcția de conversie pe care o folosește LocationService
fun LocationEntity.toResponseDTO(): LocationResponse {
    return LocationResponse(
        id = this.id ?: throw IllegalStateException("Location ID cannot be null."),
        name = this.name,
        address = this.address,
        latitude = this.latitude,
        longitude = this.longitude,
        businessId = this.business.accountId
    )
}

// Funcția de extensie pentru liste trebuie să fie la nivel superior (top-level)
fun List<LocationEntity>.toResponseDTOList(): List<LocationResponse> {
    return this.map { it.toResponseDTO() }
}