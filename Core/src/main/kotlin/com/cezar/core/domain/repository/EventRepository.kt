package com.cezar.core.domain.repository

import com.cezar.core.domain.model.event.EventEntity
import com.cezar.core.domain.model.event.EventStatus
import com.cezar.core.domain.model.event.EventType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface EventRepository : JpaRepository<EventEntity, Long>{
    fun findByTypeAndStatusAndEventDateTimeAfter(type: EventType, status: EventStatus, eventDateTime: LocalDateTime): List<EventEntity>
}