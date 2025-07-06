package com.cezar.core.application.service.location

import com.cezar.core.application.dto.location.*
import com.cezar.core.application.dto.shared.FacilityDTO
import com.cezar.core.domain.model.locations.*
import com.cezar.core.domain.repository.FacilityRepository
import com.cezar.core.domain.repository.LocationRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDateTime

@Service
class LocationConfigService(
    private val locationRepository: LocationRepository,
    private val facilityRepository: FacilityRepository,
    private val locationService: LocationService
) {
    // CREATE
    @Transactional
    fun addSportConfiguration(businessAccountId: Long, locationId: Long, dto: SportConfigurationDTO): SportConfigurationDTO {
        val location = locationService.findLocationForBusinessOrThrow(locationId, businessAccountId)
        val newConfig = SportConfiguration(location = location, sportName = dto.sportName, surfaceType = dto.surfaceType, recommendedCapacity = dto.recommendedCapacity, minBookingDuration = dto.minBookingDuration, bookingSlotIncrement = dto.bookingSlotIncrement)
        location.sportConfigurations.add(newConfig)
        val savedConfig = locationRepository.save(location).sportConfigurations.last()
        return savedConfig.toDTO()
    }

    @Transactional
    fun addPricingRule(businessAccountId: Long, locationId: Long, dto: PricingRuleDTO): PricingRuleDTO {
        val location = locationService.findLocationForBusinessOrThrow(locationId, businessAccountId)
        val newRule = PricingRule(location = location, ruleName = dto.ruleName, daysOfWeek = dto.daysOfWeek, startTime = dto.startTime, endTime = dto.endTime, pricePerHour = dto.pricePerHour)
        location.pricingRules.add(newRule)
        val savedRule = locationRepository.save(location).pricingRules.last()
        return savedRule.toDTO()
    }

    // UPDATE


    @Transactional
    fun updateOperatingHours(businessAccountId: Long, locationId: Long, request: UpdateOperatingHoursRequest): Set<OperatingHourDTO> {
        val location = locationService.findLocationForBusinessOrThrow(locationId, businessAccountId)
        location.operatingHours.clear()
        request.hours.mapTo(location.operatingHours) { dto ->
            OperatingHour(location = location, dayOfWeek = dto.dayOfWeek, openTime = dto.openTime, closeTime = dto.closeTime)
        }
        location.updatedAt = LocalDateTime.now()
        return locationRepository.save(location).operatingHours.map { it.toDTO() }.toSet()
    }

    @Transactional
    fun updateFacilities(businessAccountId: Long, locationId: Long, request: UpdateFacilitiesRequest): Set<FacilityDTO> {
        val location = locationService.findLocationForBusinessOrThrow(locationId, businessAccountId)
        location.facilities = facilityRepository.findAllById(request.facilityIds).toMutableSet()
        location.updatedAt = LocalDateTime.now()
        return locationRepository.save(location).facilities.map { it.toDTO() }.toSet()
    }

    // DELETE

    @Transactional
    fun deletePricingRule(businessAccountId: Long, locationId: Long, ruleId: Long) {
        val location = locationService.findLocationForBusinessOrThrow(locationId, businessAccountId)
        val ruleToRemove = location.pricingRules.find { it.id == ruleId }
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Pricing rule with ID $ruleId not found.")
        location.pricingRules.remove(ruleToRemove)
        locationRepository.save(location)
    }


    @Transactional
    fun deleteSportConfiguration(businessAccountId: Long, locationId: Long, configId: Long) {
        val location = locationService.findLocationForBusinessOrThrow(locationId, businessAccountId)
        val configToRemove = location.sportConfigurations.find { it.id == configId }
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Sport configuration with ID $configId not found.")
        location.sportConfigurations.remove(configToRemove)
        locationRepository.save(location)
    }

    @Transactional
    fun updateBookingRules(businessAccountId: Long, locationId: Long, request: BookingRulesUpdateRequest): LocationDetailDTO {
        val location = locationService.findLocationForBusinessOrThrow(locationId, businessAccountId)
        location.maxBookingAdvanceDays = request.maxBookingAdvanceDays
        location.cancellationPolicy = request.cancellationPolicy
        return locationRepository.save(location).toDetailDTO()
    }
}