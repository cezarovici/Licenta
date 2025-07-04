package com.cezar.core.application.service.location

import com.cezar.core.application.dto.location.*
import com.cezar.core.application.dto.shared.FacilityDTO
import com.cezar.core.domain.model.business.BusinessEntity
import com.cezar.core.domain.model.locations.LocationEntity
import com.cezar.core.domain.model.locations.LocationPhotos
import com.cezar.core.domain.model.locations.OperatingHour
import com.cezar.core.domain.model.locations.toDetailDTO
import com.cezar.core.domain.model.locations.toResponseDTO
import com.cezar.core.domain.repository.BusinessRepository
import com.cezar.core.domain.repository.FacilityRepository
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
    private val businessRepository: BusinessRepository,
    private val facilityRepository: FacilityRepository
) {
    companion object {
        private val logger = LoggerFactory.getLogger(LocationManagementService::class.java)
    }

    @Transactional
    fun createLocation(businessAccountId: Long, request: LocationCreateRequestDTO): LocationResponse {
        val business = findBusinessOrThrow(businessAccountId)
        val newLocation = LocationEntity(
            name = request.name,
            address = request.address,
            latitude = request.latitude,
            longitude = request.longitude,
            business = business,
        )

        val savedLocation = locationRepository.save(newLocation)
        business.addLocation(savedLocation)
        businessRepository.save(business)

        return savedLocation.toResponseDTO()
    }

    @Transactional(readOnly = true)
    fun getLocationByIdForBusiness(businessAccountId: Long, locationId: Long): LocationDetailDTO {
        return findLocationForBusinessOrThrow(locationId, businessAccountId).toDetailDTO()
    }

    @Transactional(readOnly = true)
    fun getAllLocationsForBusiness(businessAccountId: Long): List<LocationResponse> {
        return locationRepository.findAllByBusinessAccountId(businessAccountId).map { it.toResponseDTO() }
    }

    @Transactional
    fun updateLocation(businessAccountId: Long, locationId: Long, request: LocationUpdateRequest): LocationResponse {
        val location = findLocationForBusinessOrThrow(locationId, businessAccountId)

        request.name?.let { location.name = it }
        request.address?.let { location.address = it }
        request.latitude?.let { location.latitude = it }
        request.longitude?.let { location.longitude = it }
        location.updatedAt = LocalDateTime.now()

        return locationRepository.save(location).toResponseDTO()
    }

    @Transactional
    fun deleteLocation(businessAccountId: Long, locationId: Long) {
        val location = findLocationForBusinessOrThrow(locationId, businessAccountId)
        locationRepository.delete(location)
    }

    @Transactional
    fun updateOperatingHours(businessAccountId: Long, locationId: Long, request: UpdateOperatingHoursRequest): Set<OperatingHourDTO> {
        val location = findLocationForBusinessOrThrow(locationId, businessAccountId)
        location.operatingHours.clear()
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

    @Transactional
    fun updateFacilities(businessAccountId: Long, locationId: Long, request: UpdateFacilitiesRequest): Set<FacilityDTO> {
        val location = findLocationForBusinessOrThrow(locationId, businessAccountId)
        val newFacilities = facilityRepository.findAllById(request.facilityIds).toMutableSet()
        location.facilities = newFacilities
        location.updatedAt = LocalDateTime.now()
        locationRepository.save(location)
        return newFacilities.map { it.toDTO() }.toSet()
    }

    @Transactional
    fun addPhotoToLocation(businessAccountId: Long, locationId: Long, request: PhotoCreateRequest): LocationPhotoDTO {
        val location = findLocationForBusinessOrThrow(locationId, businessAccountId)
        val newPhoto = LocationPhotos(
            photoUrl = request.url,
            caption = request.description,
            location = location
        )
        location.addPhoto(newPhoto)
        locationRepository.save(location)
        return newPhoto.toDTO()
    }

    @Transactional
    fun deletePhotoFromLocation(businessAccountId: Long, locationId: Long, photoId: Long) {
        val location = findLocationForBusinessOrThrow(locationId, businessAccountId)
        val photoToRemove = location.photos.find { it.id == photoId }
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Photo with ID $photoId not found for this location.")
        location.photos.remove(photoToRemove)
        locationRepository.save(location)
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