package com.cezar.core.application.controller.event

import com.cezar.core.application.dto.EventDetailDTO
import com.cezar.core.application.dto.EventSummaryDTO
import com.cezar.core.application.dto.event.CreateEventRequest
import com.cezar.core.application.dto.event.UpdateEventRequest
import com.cezar.core.application.service.event.EventService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/events")
@Tag(name = "Event Management API", description = "Endpoints for creating, viewing, and participating in events")
class EventController(
    private val eventService: EventService
) {
    // --- ENDPOINTS PENTRU CREATORI DE EVENIMENTE ---

    @PostMapping
    @Operation(summary = "Create a new event (for authenticated clients)")
    fun createEvent(
        @RequestBody @Valid request: CreateEventRequest,
        @RequestHeader("X-User-Id") clientAccountId: Long
    ): ResponseEntity<EventDetailDTO> {
        val newEvent = eventService.createEvent(request, clientAccountId)
        return ResponseEntity.status(HttpStatus.CREATED).body(newEvent)
    }

    @PutMapping("/{eventId}")
    @Operation(summary = "Update an existing event (creator only)")
    fun updateEvent(
        @PathVariable eventId: Long,
        @RequestBody @Valid request: UpdateEventRequest,
        @RequestHeader("X-User-Id") clientAccountId: Long
    ): ResponseEntity<EventDetailDTO> {
        val updatedEvent = eventService.updateEvent(eventId, request, clientAccountId)
        return ResponseEntity.ok(updatedEvent)
    }

    @DeleteMapping("/{eventId}")
    @Operation(summary = "Delete an event (creator only)")
    fun deleteEvent(
        @PathVariable eventId: Long,
        @RequestHeader("X-User-Id") clientAccountId: Long
    ): ResponseEntity<Void> {
        eventService.deleteEvent(eventId, clientAccountId)
        return ResponseEntity.noContent().build()
    }

    // --- ENDPOINTS PUBLICI (de citire) ---

    @GetMapping
    @Operation(summary = "Get a list of all upcoming public events")
    fun getAllUpcomingEvents(): ResponseEntity<List<EventSummaryDTO>> {
        val events = eventService.findAllUpcomingPublicEvents()
        return ResponseEntity.ok(events)
    }

    @GetMapping("/{eventId}")
    @Operation(summary = "Get detailed information about a specific event")
    fun getEventDetails(@PathVariable eventId: Long): ResponseEntity<EventDetailDTO> {
        val eventDetails = eventService.findEventDetailsById(eventId)
        return ResponseEntity.ok(eventDetails)
    }

    // --- ENDPOINTS PENTRU CLIENȚI (participanți) ---

    @PostMapping("/{eventId}/join")
    @Operation(summary = "Join an event (for authenticated clients)")
    fun joinEvent(
        @PathVariable eventId: Long,
        @RequestHeader("X-User-Id") clientAccountId: Long
    ): ResponseEntity<Unit> {
        eventService.joinEvent(eventId, clientAccountId)
        return ResponseEntity.ok().build()
    }

    @DeleteMapping("/{eventId}/leave")
    @Operation(summary = "Leave an event (for authenticated clients)")
    fun leaveEvent(
        @PathVariable eventId: Long,
        @RequestHeader("X-User-Id") clientAccountId: Long
    ): ResponseEntity<Unit> {
        eventService.leaveEvent(eventId, clientAccountId)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/my-participations")
    @Operation(summary = "Get all events the current client is participating in")
    fun getMyParticipations(@RequestHeader("X-User-Id") clientAccountId: Long): ResponseEntity<List<EventSummaryDTO>> {
        val myEvents = eventService.findEventsByParticipant(clientAccountId)
        return ResponseEntity.ok(myEvents)
    }
}