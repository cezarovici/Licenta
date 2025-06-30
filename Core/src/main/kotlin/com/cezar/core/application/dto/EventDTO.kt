package com.cezar.core.application.dto

data class ClientDTO(
    val id: Long?,
    val username: String
)

data class LocationDTO(
    val id: Long?,
    val name: String,
    val address: String
)

data class EventPhotoDTO(
    val id: Long?,
    val photoUrl: String,
    val caption: String?
)

data class EventDetailsDTO(
    val description: String?,
    val maxParticipants: Int?,
    val costPerPerson: java.math.BigDecimal,
    val skillLevel: com.cezar.core.domain.model.event.SkillLevel
)

data class EventParticipationDTO(
    val client: ClientDTO,
    val joinDateTime: java.time.LocalDateTime
)