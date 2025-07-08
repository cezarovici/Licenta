package com.cezar.core.application.service.event

import com.cezar.core.application.dto.EventDetailDTO
import com.cezar.core.application.dto.EventSummaryDTO
import com.cezar.core.application.dto.event.CreateEventRequest
import com.cezar.core.application.dto.event.UpdateEventRequest
import com.cezar.core.domain.model.event.*
import com.cezar.core.domain.repository.ClientRepository
import com.cezar.core.domain.repository.EventParticipationRepository
import com.cezar.core.domain.repository.EventRepository
import com.cezar.core.domain.repository.LocationRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.math.BigDecimal
import java.time.LocalDateTime

@Service
@Transactional
class EventService(
    private val eventRepository: EventRepository,
    private val locationRepository: LocationRepository,
    private val clientRepository: ClientRepository,
    private val eventParticipationRepository: EventParticipationRepository
) {

    /**
     * Creează un eveniment nou.
     * Creatorul evenimentului este adăugat automat ca participant.
     */
    fun createEvent(request: CreateEventRequest, creatorAccountId: Long): EventDetailDTO {
        val creator = clientRepository.findByAccountId(creatorAccountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Client creator not found for Account ID: $creatorAccountId")

        val location = locationRepository.findById(request.locationId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found with ID: ${request.locationId}") }

        val eventEntity = EventEntity(
            title = request.title,
            sport = request.sport,
            eventDateTime = request.eventDateTime,
            location = location,
            type = request.eventType,
            creator = creator,
            durationInMinutes = 0,
            totalBookingCost = BigDecimal.ZERO
        )

        val details = EventDetails(
            description = request.description,
            skillLevel = request.skillLevel ?: SkillLevel.ALL_LEVELS,
        )
        eventEntity.addDetails(details)

        val participation = EventParticipation(event = eventEntity, client = creator)
        eventEntity.addParticipation(participation)


        val savedEvent = eventRepository.save(eventEntity)
        return savedEvent.toDetailDTO()
    }

    /**
     * Actualizează un eveniment existent.
     * Doar creatorul evenimentului poate face această acțiune.
     */
    fun updateEvent(eventId: Long, request: UpdateEventRequest, clientAccountId: Long): EventDetailDTO {
        val event = findEventAndVerifyOwnership(eventId, clientAccountId)

        request.title?.let { event.title = it }
        request.sport?.let { event.sport = it }
        request.eventDateTime?.let { event.eventDateTime = it }
        request.eventType?.let { event.type = it }

        // Actualizează detaliile
        request.description?.let { event.details?.description = it }
        request.skillLevel?.let { event.details?.skillLevel = it }


        val updatedEvent = eventRepository.save(event)
        return updatedEvent.toDetailDTO()
    }

    /**
     * Șterge un eveniment.
     * Doar creatorul evenimentului poate face această acțiune.
     */
    fun deleteEvent(eventId: Long, clientAccountId: Long) {
        val event = findEventAndVerifyOwnership(eventId, clientAccountId)
        eventRepository.delete(event)
    }

    /**
     * Metodă ajutătoare pentru a găsi un eveniment și a verifica dacă utilizatorul curent este creatorul.
     */
    private fun findEventAndVerifyOwnership(eventId: Long, clientAccountId: Long): EventEntity {
        val event = eventRepository.findById(eventId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found with ID: $eventId") }

        if (event.creator.accountId != clientAccountId) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "You are not the creator of this event.")
        }

        return event
    }

    /**
     * Găsește toate evenimentele publice viitoare.
     * Folosit pentru pagina principală sau de explorare.
     */
    @Transactional(readOnly = true)
    fun findAllUpcomingPublicEvents(): List<EventSummaryDTO> {
        return eventRepository.findByTypeAndStatusAndEventDateTimeAfter(
            EventType.PUBLIC,
            EventStatus.PLANNED,
            LocalDateTime.now()
        ).map { it.toSummaryDTO() }
    }

    /**
     * Găsește detaliile complete pentru un eveniment specific.
     */
    @Transactional(readOnly = true)
    fun findEventDetailsById(eventId: Long): EventDetailDTO {
        return eventRepository.findById(eventId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found with ID: $eventId") }
            .toDetailDTO()
    }

    /**
     * Permite unui client să se alăture unui eveniment.
     * Include validări de business (eveniment plin, deja înscris, etc.).
     */
    fun joinEvent(eventId: Long, clientAccountId: Long) {
        val event = eventRepository.findById(eventId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found with ID: $eventId") }

        val client = clientRepository.findByAccountId(clientAccountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found for Account ID: $clientAccountId")

        if (event.status != EventStatus.PLANNED) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot join an event that is not planned.")
        }
        if (event.participations.any { it.client.id == client.id }) {
            throw ResponseStatusException(HttpStatus.CONFLICT, "You are already a participant in this event.")
        }
        if (event.details?.maxParticipants != null && event.participations.size >= event.details!!.maxParticipants!!) {
            throw ResponseStatusException(HttpStatus.CONFLICT, "This event is full.")
        }

        val participation = EventParticipation(
            event = event,
            client = client
        )
        event.addParticipation(participation)
    }

    /**
     * Permite unui client să părăsească un eveniment.
     */
    fun leaveEvent(eventId: Long, clientAccountId: Long) {
        val event = eventRepository.findById(eventId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found with ID: $eventId") }

        val client = clientRepository.findByAccountId(clientAccountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found for Account ID: $clientAccountId")

        val participationToRemove = event.participations.find { it.client.id == client.id }
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "You are not a participant in this event.")

        event.removeParticipation(participationToRemove)
    }

    /**
     * Găsește toate evenimentele la care participă un anumit client.
     * Folosit pentru secțiunea "Evenimentele Mele" din profilul clientului.
     */
    @Transactional(readOnly = true)
    fun findEventsByParticipant(clientAccountId: Long): List<EventSummaryDTO> {
        val client = clientRepository.findByAccountId(clientAccountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found for Account ID: $clientAccountId")

        return eventParticipationRepository.findByClientId(client.id!!)
            .map { it.event!!.toSummaryDTO() }
    }
}