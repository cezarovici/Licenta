package com.cezar.core.application.dto.event

import com.cezar.core.domain.model.event.EventType
import com.cezar.core.domain.model.event.SkillLevel
import jakarta.validation.constraints.Future
import java.time.LocalDateTime


data class UpdateEventRequest(
    val title: String?,
    val sport: String?,
    @field:Future(message = "Event date must be in the future")
    val eventDateTime: LocalDateTime?,
    val eventType: EventType?,
    val description: String?,
    val skillLevel: SkillLevel?
)