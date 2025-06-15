package com.cezar.core.service

import com.cezar.core.domain.model.business.BusinessEntity
import com.cezar.core.domain.model.locations.LocationEntity
import com.cezar.core.dto.location.LocationCreateRequest
import com.cezar.core.dto.location.LocationResponse
import com.cezar.core.dto.location.LocationUpdateRequest
import com.cezar.core.repository.BusinessRepository // Ai nevoie de BusinessRepository pentru a găsi BusinessEntity
import com.cezar.core.repository.LocationRepository
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDateTime

@Service
class LocationService(
    private val locationRepository: LocationRepository,
    private val businessRepository: BusinessRepository // Injectăm BusinessRepository
) {
    private val logger = LoggerFactory.getLogger(LocationService::class.java)

    /**
     * Creează o nouă locație pentru o afacere dată.
     * @param businessAccountId ID-ul contului afacerii care deține locația.
     * @param request DTO-ul cu datele noii locații.
     * @return DTO-ul locației create.
     */
    @Transactional
    fun createLocation(businessAccountId: Long, request: LocationCreateRequest): LocationResponse {
        logger.info("Creating location for businessAccountId: $businessAccountId with name: ${request.name}")

        val business = businessRepository.findByAccountId(businessAccountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Business with account ID $businessAccountId not found.")

        val newLocation = LocationEntity(
            name = request.name,
            address = request.address,
            latitude = request.latitude,
            longitude = request.longitude,
            business = business // Asociază locația cu afacerea
        )

        val savedLocation = locationRepository.save(newLocation)
        logger.info("Location created successfully with ID: ${savedLocation.id} for business: ${businessAccountId}")
        return mapToLocationResponse(savedLocation)
    }

    /**
     * Obține o locație specifică a unei afaceri.
     * @param businessAccountId ID-ul contului afacerii.
     * @param locationId ID-ul locației.
     * @return DTO-ul locației.
     */
    fun getLocationById(businessAccountId: Long, locationId: Long): LocationResponse {
        logger.info("Fetching location ID: $locationId for businessAccountId: $businessAccountId")
        val location = locationRepository.findByIdAndBusinessAccountId(locationId, businessAccountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Location with ID $locationId not found for business with account ID $businessAccountId.")

        return mapToLocationResponse(location)
    }

    /**
     * Obține toate locațiile unei afaceri.
     * @param businessAccountId ID-ul contului afacerii.
     * @return Lista de DTO-uri ale locațiilor.
     */
    fun getAllLocationsForBusiness(businessAccountId: Long): List<LocationResponse> {
        logger.info("Fetching all locations for businessAccountId: $businessAccountId")
        val locations = locationRepository.findAllByBusinessAccountId(businessAccountId)
        return locations.map { mapToLocationResponse(it) }
    }

    /**
     * Actualizează o locație existentă a unei afaceri.
     * @param businessAccountId ID-ul contului afacerii.
     * @param locationId ID-ul locației de actualizat.
     * @param request DTO-ul cu datele actualizate.
     * @return DTO-ul locației actualizate.
     */
    @Transactional
    fun updateLocation(businessAccountId: Long, locationId: Long, request: LocationUpdateRequest): LocationResponse {
        logger.info("Updating location ID: $locationId for businessAccountId: $businessAccountId")
        val existingLocation = locationRepository.findByIdAndBusinessAccountId(locationId, businessAccountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Location with ID $locationId not found for business with account ID $businessAccountId.")

        existingLocation.name = request.name
        existingLocation.address = request.address
        existingLocation.latitude = request.latitude
        existingLocation.longitude = request.longitude
        existingLocation.updatedAt = LocalDateTime.now() // Actualizează timestamp-ul

        val updatedLocation = locationRepository.save(existingLocation)
        logger.info("Location ID: $locationId updated successfully.")
        return mapToLocationResponse(updatedLocation)
    }

    /**
     * Șterge o locație specifică a unei afaceri.
     * @param businessAccountId ID-ul contului afacerii.
     * @param locationId ID-ul locației de șters.
     */
    @Transactional
    fun deleteLocation(businessAccountId: Long, locationId: Long) {
        logger.info("Deleting location ID: $locationId for businessAccountId: $businessAccountId")
        val locationToDelete = locationRepository.findByIdAndBusinessAccountId(locationId, businessAccountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Location with ID $locationId not found for business with account ID $businessAccountId.")

        locationRepository.delete(locationToDelete)
        logger.info("Location ID: $locationId deleted successfully.")
    }

    /**
     * Funcție helper pentru a mapa LocationEntity la LocationResponse.
     */
    private fun mapToLocationResponse(location: LocationEntity): LocationResponse {
        return LocationResponse(
            id = location.id ?: throw IllegalStateException("Location ID cannot be null after save"),
            name = location.name,
            address = location.address,
            latitude = location.latitude,
            longitude = location.longitude,
            businessId = location.business.accountId // Asigură-te că business.id nu e null.
        )
    }
}