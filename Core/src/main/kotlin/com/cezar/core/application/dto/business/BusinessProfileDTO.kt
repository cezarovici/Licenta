package com.cezar.core.application.dto.business

import java.time.LocalDateTime
import java.time.LocalTime

class BusinessDetailsDTO(
    val description: String?,
    val websiteUrl: String?,
    val phoneNumber: String?,
    val email: String?
)

data class BusinessDTO(
    val id: Long?,
    val name: String
)

data class EventDTO(
    val id: Long?,
    val name: String,
    val eventDate: LocalDateTime
)

// DTO pentru OperatingHour
data class OperatingHourDTO(
    val id: Long?,
    val dayOfWeek: String,
    val openTime: LocalTime,
    val closeTime: LocalTime
)

// DTO pentru Facility
data class FacilityDTO(
    val id: Long?,
    val name: String
)

// DTO pentru LocationPhotos
data class LocationPhotoDTO(
    val id: Long?,
    val url: String,
    val description: String?
)

data class LocationDTO(
    val id: Long?,
    val name: String,
    val address: String,
    val latitude: Double?,
    val longitude: Double?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
    val business: BusinessDTO, // Folosim DTO-ul de business, nu entitatea
    val events: Set<EventDTO>,
    val photos: Set<LocationPhotoDTO>,
    val operatingHours: Set<OperatingHourDTO>,
    val facilities: Set<FacilityDTO>
)

class BusinessPhotoDTO(
    val id: Long,
    val photoUrl: String,
    val description: String?,
    val isPrimary: Boolean
)

class BusinessProfileRequestDTO(
    val businessName: String?,
    val logoUrl: String?,
    val description: String?,
    val websiteUrl: String?,
    val phoneNumber: String?,
    val email: String?
)