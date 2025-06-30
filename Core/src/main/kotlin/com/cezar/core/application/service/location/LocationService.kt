package com.cezar.core.application.service.location

import com.cezar.core.application.dto.business.FacilityDTO
import com.cezar.core.application.dto.business.OperatingHourDTO
import com.cezar.core.application.dto.location.*
import com.cezar.core.domain.model.business.BusinessEntity
import com.cezar.core.domain.model.locations.LocationEntity
import com.cezar.core.domain.model.locations.OperatingHour
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
class LocationService(
    private val locationRepository: LocationRepository,
    private val businessRepository: BusinessRepository,
    private val facilityRepository: FacilityRepository

) {
    companion object {
        private val logger = LoggerFactory.getLogger(LocationService::class.java)
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

        return locationRepository.save(newLocation).toResponseDTO()
    }

    @Transactional
    fun updateLocation(businessAccountId: Long, locationId: Long,  request: LocationUpdateRequest) : LocationResponse{
        val business = findBusinessOrThrow(businessAccountId)
        val location = findLocationForBusinessOrThrow(locationId, businessAccountId);


        location.name = request.name
        location.address = location.address
        location.latitude = location.latitude
        location.longitude = location.longitude
        location.business = business
        return locationRepository.save(location).toResponseDTO()
    }

    @Transactional(readOnly = true)
    fun getLocationById(businessAccountId: Long, locationId: Long): LocationResponse {
        return findLocationForBusinessOrThrow(locationId, businessAccountId).toResponseDTO()
    }

    @Transactional(readOnly = true)
    fun getAllLocationsForBusiness(businessAccountId: Long): List<LocationResponse> {
        return locationRepository.findAllByBusinessAccountId(businessAccountId).toResponseDTOList()
    }

    @Transactional
    fun deleteLocation(businessAccountId: Long, locationId: Long) {
        logger.info("Deleting location $locationId for business account $businessAccountId")

        locationRepository.delete(findLocationForBusinessOrThrow(locationId, businessAccountId))
    }

    @Transactional
    fun updateLocationFacilities(businessAccountId: Long, locationId: Long, request: UpdateLocationFacilitiesRequest): Set<FacilityDTO> {
        logger.info("Updating facilities for location $locationId")
        val location = findLocationForBusinessOrThrow(locationId, businessAccountId)

        val newFacilities = facilityRepository.findAllById(request.facilityIds).toMutableSet()

        location.facilities = newFacilities
        location.updatedAt = LocalDateTime.now()

        locationRepository.save(location)

        return newFacilities.map { it.toDTO() }.toSet()
    }

    @Transactional
    fun updateOperatingHours(businessAccountId: Long, locationId: Long, request: UpdateOperatingHoursRequest): Set<OperatingHourDTO> {
        logger.info("Updating operating hours for location $locationId")
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

//    @Transactional
//    fun addPhotoToLocation(businessAccountId: Long, locationId: Long, file: MultipartFile, description: String?): LocationPhotoDTO {
//        logger.info("Adding photo to location $locationId")
//        val location = findLocationForBusinessOrThrow(locationId, businessAccountId)
//
//        // 1. Salvează fișierul folosind un serviciu dedicat
//        // val fileUrl = fileStorageService.save(file)
//
//        // Simulare URL pentru exemplu
//        //val fileUrl = "https://storage.example.com/photos/${System.currentTimeMillis()}-${file.originalFilename}"
//
//        // 2. Creează entitatea LocationPhotos
//        val newPhoto = LocationPhotos(
//            url = fileUrl,
//            description = description,
//            location = location
//        )
//
//        // 3. Adaug-o la locație folosind helper-ul
//        location.addPhoto(newPhoto)
//
//        location.updatedAt = LocalDateTime.now()
//        val savedLocation = locationRepository.save(location)
//
//        // Găsim fotografia salvată pentru a-i obține ID-ul și a o returna
//        val savedPhoto = savedLocation.photos.find { it.url == fileUrl }
//            ?: throw IllegalStateException("Saved photo not found after transaction")
//
//        return savedPhoto.toPhotoDTO()
//    }

//    @Transactional
//    fun deleteLocationPhoto(businessAccountId: Long, locationId: Long, photoId: Long) {
//        logger.info("Deleting photo $photoId from location $locationId")
//        val location = findLocationForBusinessOrThrow(locationId, businessAccountId)
//
//        val photoToRemove = location.photos.find { it.id == photoId }
//            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Photo with ID $photoId not found for this location.")
//
//        // 1. Șterge fișierul de pe storage-ul extern (opțional, dar recomandat)
//        // fileStorageService.delete(photoToRemove.url)
//
//        // 2. Datorită `orphanRemoval = true`, JPA va șterge înregistrarea din DB
//        location.photos.remove(photoToRemove)
//        location.updatedAt = LocalDateTime.now()
//
//        locationRepository.save(location)
//    }

    private fun findBusinessOrThrow(businessAccountId: Long): BusinessEntity {
        return businessRepository.findByAccountId(businessAccountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Business with account ID $businessAccountId not found.")
    }

    private fun findLocationForBusinessOrThrow(locationId: Long, businessAccountId: Long): LocationEntity {
        return locationRepository.findByIdAndBusinessAccountId(locationId, businessAccountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Location with ID $locationId not found for business with account ID $businessAccountId.")
    }
}