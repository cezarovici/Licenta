package com.cezar.core.domain.model.locations

import com.cezar.core.application.dto.location.LocationDetailDTO
import com.cezar.core.application.dto.location.LocationEventsDTO
import com.cezar.core.application.dto.location.LocationResponse
import com.cezar.core.application.dto.location.LocationSummaryDTO
import java.time.LocalDateTime

fun LocationEntity.toSummaryDTO(): LocationSummaryDTO {
    return LocationSummaryDTO(
        id = this.id!!,
        name = this.name,
        address = this.address,
        latitude = this.latitude,
        longitude = this.longitude
    )
}

fun LocationEntity.toDetailDTO(): LocationDetailDTO {
    return LocationDetailDTO(
        id = this.id!!,
        name = this.name,
        address = this.address,
        latitude = this.latitude,
        longitude = this.longitude,
        business = this.business.toLocationsDTO(),
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
            .map { it.toSummaryDTO() }
            .toSet()
    )
}

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