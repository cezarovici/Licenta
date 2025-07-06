package com.cezar.core.application.dto.event

import com.cezar.core.domain.model.event.EventType
import java.time.LocalDateTime

data class BookingRequestDTO(
    val title: String,
    val description: String?,
    val locationId: Long,
    val sport: String,
    val eventDateTime: LocalDateTime,
    val durationInMinutes: Int,
    val eventType: EventType
)
