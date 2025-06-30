package com.cezar.core.application.service.location

import com.cezar.core.application.dto.business.OperatingHourDTO
import com.cezar.core.application.dto.location.*
import com.cezar.core.domain.model.business.BusinessEntity
import com.cezar.core.domain.model.locations.LocationEntity
import com.cezar.core.domain.model.locations.OperatingHour
import com.cezar.core.domain.repository.BusinessRepository
import com.cezar.core.domain.repository.LocationRepository
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDateTime

@Service
class LocationManagementService(
    private val locationRepository: LocationRepository,
    private val businessRepository: BusinessRepository
) {
    companion object {
        private val logger = LoggerFactory.getLogger(LocationManagementService::class.java)
    }

    @Transactional
    fun createLocation(businessAccountId: Long, request: LocationCreateRequestDTO): LocationResponse {
        logger.info("Creating location '${request.name}' for business account $businessAccountId")
        val business = findBusinessOrThrow(businessAccountId)

        val newLocation = LocationEntity(
            name = request.name,
            address = request.address,
            latitude = request.latitude,
            longitude = request.longitude,
            business = business
        )

        val savedLocation = locationRepository.save(newLocation)
        business.addLocation(savedLocation)
        businessRepository.save(business)

        return savedLocation.toResponseDTO()
    }

    @Transactional(readOnly = true)
    fun getLocationByIdForBusiness(businessAccountId: Long, locationId: Long): LocationResponse {
        return findLocationForBusinessOrThrow(locationId, businessAccountId).toResponseDTO()
    }

    @Transactional(readOnly = true)
    fun getAllLocationsForBusiness(businessAccountId: Long): List<LocationResponse> {
        return locationRepository.findAllByBusinessAccountId(businessAccountId).map { it.toResponseDTO() }
    }

    @Transactional
    fun updateLocation(businessAccountId: Long, locationId: Long, request: LocationUpdateRequest): LocationResponse {
        val location = findLocationForBusinessOrThrow(locationId, businessAccountId)
        location.name = request.name
        location.address = request.address
        location.latitude = request.latitude
        location.longitude = request.longitude
        location.updatedAt = LocalDateTime.now()

        return locationRepository.save(location).toResponseDTO()
    }

    @Transactional
    fun deleteLocation(businessAccountId: Long, locationId: Long) {
        logger.info("Deleting location $locationId for business account $businessAccountId")
        val location = findLocationForBusinessOrThrow(locationId, businessAccountId)
        locationRepository.delete(location)
    }

    @Transactional
    fun updateOperatingHours(businessAccountId: Long, locationId: Long, request: UpdateOperatingHoursRequest): Set<OperatingHourDTO> {
        logger.info("Updating operating hours for location $locationId")
        val location = findLocationForBusinessOrThrow(locationId, businessAccountId)

        // `orphanRemoval=true` pe relație va șterge înregistrările vechi din DB
        location.operatingHours.clear()

        // Adăugăm noile înregistrări
        request.hours.mapTo(location.operatingHours) { dto ->
            OperatingHour(
                location = location,
                dayOfWeek = dto.dayOfWeek,
                openTime = dto.openTime,
                closeTime = dto.closeTime
            )
        }

        location.updatedAt = LocalDateTime.now()
        locationRepository.save(location)

        return location.operatingHours.map { it.toDTO() }.toSet()
    }

    private fun findBusinessOrThrow(businessAccountId: Long): BusinessEntity {
        return businessRepository.findByAccountId(businessAccountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Business with account ID $businessAccountId not found.")
    }

    private fun findLocationForBusinessOrThrow(locationId: Long, businessAccountId: Long): LocationEntity {
        return locationRepository.findByIdAndBusinessAccountId(locationId, businessAccountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Location with ID $locationId not found for business with account ID $businessAccountId.")
    }
}