package com.cezar.core.domain.repository

import com.cezar.core.domain.model.event.EventEntity
import com.cezar.core.domain.model.event.EventParticipation
import com.cezar.core.domain.model.event.EventStatus
import com.cezar.core.domain.model.event.EventType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface EventParticipationRepository : JpaRepository<EventParticipation, Long> {
    fun findByClientId(clientId: Long): List<EventParticipation>
}