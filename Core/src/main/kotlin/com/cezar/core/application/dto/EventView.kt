package com.cezar.core.application.dto

import com.cezar.core.application.dto.location.LocationEventsDTO
import com.cezar.core.application.dto.location.LocationSummaryDTO
import com.cezar.core.domain.model.event.EventStatus
import com.cezar.core.domain.model.event.EventType
import java.time.LocalDateTime

data class EventSummaryDTO(
    val id: Long?,
    val title: String,
    val sport: String,
    val eventDateTime: LocalDateTime,
    val type: EventType,
    val status: EventStatus,
    val location: LocationSummaryDTO,
    val participantsCount: Int
)

data class EventDetailDTO(
    val id: Long?,
    val title: String,
    val sport: String,
    val eventDateTime: LocalDateTime,
    val type: EventType,
    val status: EventStatus,
    val creator: ClientDTO,
    val location: LocationEventsDTO,
    val details: EventDetailsDTO?,
    val photos: Set<EventPhotoDTO>,
    val participations: Set<EventParticipationDTO>,
    val participantsCount: Int
)