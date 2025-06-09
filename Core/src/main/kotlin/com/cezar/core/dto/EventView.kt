package com.cezar.core.dto

import com.cezar.core.domain.model.event.EventType
import com.cezar.core.domain.model.event.SkillLevel
import java.math.BigDecimal
import java.time.LocalDateTime

data class EventView(
    val id: Long,
    val title: String,
    val sport: String,
    val eventDateTime: LocalDateTime,
    val eventType: com.cezar.core.domain.model.event.EventType,
    val creator: UserView, // Detalii despre creator
    val location: LocationView, // Detalii despre locație
    val description: String?,
    val maxParticipants: Int?,
    val currentParticipants: Int,
    val costPerPerson: BigDecimal,
    val skillLevel: com.cezar.core.domain.model.event.SkillLevel
)

// DTO-uri ajutătoare pentru a construi EventView
data class LocationView(
    val id: Long,
    val name: String,
    val address: String
)