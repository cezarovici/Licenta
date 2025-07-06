package com.cezar.core.application.controller.event

import com.cezar.core.application.dto.EventDetailDTO
import com.cezar.core.application.dto.EventSummaryDTO
import com.cezar.core.application.dto.event.CreateEventRequest
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

    @DeleteMapping("/{eventId}/join")
    @Operation(summary = "Leave an event (for authenticated clients)")
    fun leaveEvent(
        @PathVariable eventId: Long,
        @RequestHeader("X-User-Id") clientAccountId: Long
    ): ResponseEntity<Unit> {
        eventService.leaveEvent(eventId, clientAccountId)
        return ResponseEntity.noContent().build()
    }


    // --- ENDPOINTS SPECIFICE PENTRU PROFILURI ---

    // Acest endpoint ar putea fi mutat și în ClientProfileController, dar este logic și aici.
    @GetMapping("/my-participations")
    @Operation(summary = "Get all events the current client is participating in")
    fun getMyParticipations(@RequestHeader("X-User-Id") clientAccountId: Long): ResponseEntity<List<EventSummaryDTO>> {
        val myEvents = eventService.findEventsByParticipant(clientAccountId)
        return ResponseEntity.ok(myEvents)
    }
}