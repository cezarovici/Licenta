package com.cezar.core.application.controller.business

import com.cezar.core.application.dto.location.LocationPhotoDTO
import com.cezar.core.application.dto.location.PhotoCreateRequest
import com.cezar.core.application.service.location.LocationPhotoService
import com.cezar.core.config.AuthorizeBusinessOwner

import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/business-profiles/{businessAccountId}/locations/{locationId}/photos")
@AuthorizeBusinessOwner
class LocationPhotoController(private val locationManagementService: LocationPhotoService) {
    private val logger = LoggerFactory.getLogger(LocationPhotoController::class.java)

    @PostMapping
    fun addPhoto(
        @PathVariable businessAccountId: Long,
        @PathVariable locationId: Long,
        @RequestBody  request: PhotoCreateRequest
    ): ResponseEntity<LocationPhotoDTO> {
        logger.info("Adding photo")
        logger.info("S-a primit urmatorul request {}", request)
        val newPhoto = locationManagementService.addPhotoToLocation(businessAccountId, locationId, request)
        return ResponseEntity.status(HttpStatus.CREATED).body(newPhoto)
    }

    @DeleteMapping("/{photoId}")
    fun deletePhoto(
        @PathVariable businessAccountId: Long,
        @PathVariable locationId: Long,
        @PathVariable photoId: Long
    ): ResponseEntity<Void> {
        logger.info("Deleting photo")
        locationManagementService.deletePhotoFromLocation(businessAccountId, locationId, photoId)
        return ResponseEntity.noContent().build()
    }
}