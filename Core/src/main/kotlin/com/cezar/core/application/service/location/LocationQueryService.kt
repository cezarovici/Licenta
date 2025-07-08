package com.cezar.core.application.service.location

import com.cezar.core.application.dto.location.LocationDetailDTO
import com.cezar.core.application.dto.location.LocationSummaryDTO
import com.cezar.core.domain.model.locations.toDetailDTO
import com.cezar.core.domain.model.locations.toSummaryDTO
import com.cezar.core.domain.repository.LocationRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException

@Service
class LocationQueryService(
    private val locationRepository: LocationRepository
) {
    @Transactional(readOnly = true)
    fun getAllLocationsSummary(): List<LocationSummaryDTO> {
        return locationRepository.findAll().map { it.toSummaryDTO() }
    }

    @Transactional(readOnly = true)
    fun getLocationDetails(locationId: Long): LocationDetailDTO {
        val location = locationRepository.findById(locationId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found with ID: $locationId") }
        return location.toDetailDTO()
    }



}