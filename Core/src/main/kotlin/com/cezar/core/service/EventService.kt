package com.cezar.core.service

import com.cezar.core.domain.model.event.*
import com.cezar.core.dto.*
import com.cezar.core.repository.*
import jakarta.persistence.EntityNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal

@Service
class EventService(
    private val eventRepository: EventRepository,
    private val locationRepository: LocationRepository,
    private val clientRepository: ClientRepository
) {

    @Transactional
    fun createEvent(request: CreateEventRequest, creatorId: Long): EventView {
        if (request.eventType == EventType.PUBLIC && request.maxParticipants == null) {
            throw IllegalArgumentException("Public events must have a maximum number of participants.")
        }

        val creator = clientRepository.findById(creatorId)
            .orElseThrow { EntityNotFoundException("Creator with ID $creatorId not found.") }

        val location = locationRepository.findById(request.locationId)
            .orElseThrow { EntityNotFoundException("Location with ID ${request.locationId} not found.") }

        val newEvent = EventEntity(
            title = request.title,
            sport = request.sport,
            eventDateTime = request.eventDateTime,
            type = request.eventType,
            creator = creator,
            location = location
        )

        val newDetails = EventDetails(
            description = request.description,
            maxParticipants = if (request.eventType == EventType.PUBLIC) request.maxParticipants else null,
            costPerPerson = request.costPerPerson ?: BigDecimal.ZERO,
            skillLevel = request.skillLevel ?: SkillLevel.ALL_LEVELS
        )

        val creatorParticipation = EventParticipation(client = creator)

        newEvent.addDetails(newDetails)
        newEvent.addParticipation(creatorParticipation)

        val savedEvent = eventRepository.save(newEvent)

        return mapToEventView(savedEvent)
    }

    private fun mapToEventView(event: EventEntity): EventView {
        val details = event.details!!
        val creator = event.creator
        return EventView(
            id = event.id!!,
            title = event.title,
            sport = event.sport,
            eventDateTime = event.eventDateTime,
            eventType = event.type,
            creator = UserView(creator.id!!, creator.firstName, creator.lastName),
            location = LocationView(event.location.id!!, event.location.name, event.location.address),
            description = details.description,
            maxParticipants = details.maxParticipants,
            currentParticipants = event.participations.size,
            costPerPerson = details.costPerPerson,
            skillLevel = details.skillLevel
        )
    }
}