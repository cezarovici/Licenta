package com.cezar.core.domain.repository

import com.cezar.core.domain.model.event.EventEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface EventRepository : JpaRepository<EventEntity, Long>