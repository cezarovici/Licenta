package com.cezar.core.application.dto.event

import jakarta.validation.constraints.Future
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import java.math.BigDecimal
import java.time.LocalDateTime

data class CreateEventRequest(
    @field:NotBlank(message = "Title is required")
    val title: String,

    @field:NotBlank(message = "Sport is required")
    val sport: String,

    @field:Future(message = "Event date must be in the future")
    val eventDateTime: LocalDateTime,

    @field:NotNull(message = "Location ID is required")
    val locationId: Long,

    @field:NotNull(message = "Event type is required")
    val eventType: com.cezar.core.domain.model.event.EventType,

    val description: String?,

    @field:Min(value = 2, message = "Maximum participants must be at least 2")
    val maxParticipants: Int?,

    val costPerPerson: BigDecimal?,

    val skillLevel: com.cezar.core.domain.model.event.SkillLevel?
)