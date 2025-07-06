package com.cezar.core.application.service.location

import com.cezar.core.application.dto.location.LocationPhotoDTO
import com.cezar.core.application.dto.location.PhotoCreateRequest
import com.cezar.core.domain.model.business.BusinessEntity
import com.cezar.core.domain.model.locations.LocationPhotos
import com.cezar.core.domain.repository.BusinessRepository
import com.cezar.core.domain.repository.LocationPhotosRepository
import com.cezar.core.domain.repository.LocationRepository
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException

@Service
class LocationPhotoService(
    private val locationRepository: LocationRepository,
    private val locationPhotosRepository: LocationPhotosRepository,
    private val locationService: LocationService,
    private val businessRepository: BusinessRepository
) {
    private val logger = LoggerFactory.getLogger(LocationPhotoService::class.java)

    @Transactional
    fun addPhotoToLocation(businessAccountId: Long, locationId: Long, request: PhotoCreateRequest): LocationPhotoDTO {
        val location = locationService.findLocationForBusinessOrThrow(locationId, businessAccountId)
        val newPhoto = LocationPhotos(
            photoUrl = request.url,
            caption = request.description,
            location = location
        )
        val savedPhoto = locationPhotosRepository.save(newPhoto)
        return savedPhoto.toDTO()
    }

    @Transactional(readOnly = true)
    fun getAllPhotosForBusiness(businessAccountId: Long): List<LocationPhotoDTO> {
        findBusinessOrThrow(businessAccountId)
        val photos = locationPhotosRepository.findAllByLocation_Business_AccountId(businessAccountId)
        return photos.map { it.toDTO() }
    }

    @Transactional
    fun deletePhotoFromLocation(businessAccountId: Long, locationId: Long, photoId: Long) {
        val location = locationService.findLocationForBusinessOrThrow(locationId, businessAccountId)

        val photoToRemove = locationPhotosRepository.findByIdAndLocation_Id(photoId, locationId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Photo with ID $photoId not found for this location.")


        if (photoToRemove.location!!.id != location.id) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "Photo does not belong to this location.")
        }

        logger.info("Deleting photo from location: {}", photoToRemove)
        locationPhotosRepository.delete(photoToRemove)
    }


    private fun findBusinessOrThrow(businessAccountId: Long): BusinessEntity {
        return businessRepository.findByAccountId(businessAccountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Business with account ID $businessAccountId not found.")
    }
}