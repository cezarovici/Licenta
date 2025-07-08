// Fișier nou: main/kotlin/com/cezar/core/application/service/location/LocationService.kt
package com.cezar.core.application.service.location

import com.cezar.core.application.dto.location.*
import com.cezar.core.domain.model.business.BusinessEntity
import com.cezar.core.domain.model.locations.*
import com.cezar.core.domain.repository.BusinessRepository
import com.cezar.core.domain.repository.FacilityRepository
import com.cezar.core.domain.repository.LocationRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDateTime
import java.util.*

@Service
class LocationService(
    private val locationRepository: LocationRepository,
    private val businessRepository: BusinessRepository,
    private val facilityRepository: FacilityRepository
) {
    @Transactional
    fun createLocation(businessAccountId: Long, request: LocationCreateRequestDTO): LocationResponse {
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
        return savedLocation.toResponseDTO()
    }

    @Transactional
    fun createCompleteLocation(businessAccountId: Long, request: CreateCompleteLocationRequestDTO): LocationDetailDTO {
        val business = findBusinessOrThrow(businessAccountId)

        // 1. Creăm entitatea de bază a locației
        val newLocation = LocationEntity(
            name = request.name,
            address = request.address,
            latitude = request.latitude,
            longitude = request.longitude,
            business = business
        )

        // 2. Adăugăm pozele
        request.photos?.mapTo(newLocation.photos) { photoDto ->
            LocationPhotos(
                photoUrl = photoDto.url,
                caption = photoDto.description,
                location = newLocation
            )
        }

        // 3. Adăugăm programul de funcționare
        request.operatingHours?.mapTo(newLocation.operatingHours) { hourDto ->
            OperatingHour(
                dayOfWeek = hourDto.dayOfWeek,
                openTime = hourDto.openTime,
                closeTime = hourDto.closeTime,
                location = newLocation
            )
        }

        // 4. Adăugăm facilitățile (presupunând că ele există deja în sistem)
        request.facilityIds?.let {
            val facilities = facilityRepository.findAllById(it).toMutableSet()
            newLocation.facilities = facilities
        }

        // 5. Adăugăm regulile de preț
        request.pricingRules?.mapTo(newLocation.pricingRules) { ruleDto ->
            PricingRule(
                location = newLocation,
                ruleName = ruleDto.ruleName,
                daysOfWeek = ruleDto.daysOfWeek,
                startTime = ruleDto.startTime,
                endTime = ruleDto.endTime,
                pricePerHour = ruleDto.pricePerHour
            )
        }

        // 6. Adăugăm configurațiile sportive
        request.sportConfigurations?.mapTo(newLocation.sportConfigurations) { sportDto ->
            SportConfiguration(
                location = newLocation,
                sportName = sportDto.sportName,
                surfaceType = sportDto.surfaceType,
                recommendedCapacity = sportDto.recommendedCapacity,
                minBookingDuration = sportDto.minBookingDuration,
                bookingSlotIncrement = sportDto.bookingSlotIncrement
            )
        }

        // 7. Setăm regulile de booking
        request.bookingRules?.let {
            newLocation.maxBookingAdvanceDays = it.maxBookingAdvanceDays
            newLocation.cancellationPolicy = it.cancellationPolicy
        }

        // 8. Salvăm locația completă și o returnăm ca DTO de detaliu
        val savedLocation = locationRepository.save(newLocation)
        business.addLocation(savedLocation) // Nu uita să menții consistența relației

        return savedLocation.toDetailDTO()
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

    // Metodele private de căutare pot rămâne aici sau pot fi mutate într-o clasă helper
    private fun findBusinessOrThrow(businessAccountId: Long): BusinessEntity {
        return businessRepository.findByAccountId(businessAccountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Business with account ID $businessAccountId not found.")
    }

    fun findLocationForBusinessOrThrow(locationId: Long, businessAccountId: Long): LocationEntity {
        val location = locationRepository.findById(locationId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Location with ID $locationId not found.") }

        if (location.business.accountId != businessAccountId) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "Location does not belong to the business account.")
        }

        return location
    }
}