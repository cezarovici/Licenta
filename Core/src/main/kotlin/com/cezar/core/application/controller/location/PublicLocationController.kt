package com.cezar.core.application.controller.location

import com.cezar.core.application.dto.location.LocationDetailDTO
import com.cezar.core.application.dto.location.LocationSummaryDTO
import com.cezar.core.application.service.location.LocationQueryService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/locations")
class PublicLocationController(
    private val locationQueryService: LocationQueryService
) {

    /**
     * Returnează o listă sumară cu toate locațiile din sistem.
     */
    @GetMapping
    fun getAllLocations(): ResponseEntity<List<LocationSummaryDTO>> {
        val locations = locationQueryService.getAllLocationsSummary()
        return ResponseEntity.ok(locations)
    }

    /**
     * Returnează detalii complete pentru o locație specifică.
     */
    @GetMapping("/{id}")
    fun getLocationDetails(@PathVariable id: Long): ResponseEntity<LocationDetailDTO> {
        val locationDetails = locationQueryService.getLocationDetails(id)
        return ResponseEntity.ok(locationDetails)
    }
}