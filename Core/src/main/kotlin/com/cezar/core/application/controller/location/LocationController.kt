package com.cezar.core.application.controller.location

// Importurile noi necesare
import com.cezar.core.application.dto.business.FacilityDTO
import com.cezar.core.application.dto.location.UpdateLocationFacilitiesRequest
import com.cezar.core.application.dto.location.UpdateOperatingHoursRequest

import com.cezar.core.application.dto.location.LocationCreateRequestDTO
import com.cezar.core.application.dto.location.LocationResponse
import com.cezar.core.application.dto.location.LocationUpdateRequest
import com.cezar.core.application.service.location.LocationService
import com.cezar.core.config.AuthorizeBusinessOwner
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/business-profiles/{businessAccountId}/locations")
@AuthorizeBusinessOwner
class LocationController(
    private val locationService: LocationService
) {

    // --- METODE NOI ADĂUGATE ---

    /**
     * Actualizează complet setul de facilități pentru o locație.
     * Primește o listă de ID-uri de facilități.
     */
    @PutMapping("/{locationId}/facilities")
    fun updateFacilities(
        @PathVariable businessAccountId: Long,
        @PathVariable locationId: Long,
        @RequestBody @Valid request: UpdateLocationFacilitiesRequest
    ): ResponseEntity<Set<FacilityDTO>> {
        val facilities = locationService.updateLocationFacilities(businessAccountId, locationId, request)
        return ResponseEntity.ok(facilities)
    }

    /**
     * Actualizează complet programul de funcționare pentru o locație.
     * Primește o listă de obiecte cu ziua și orele.
     */
    @PutMapping("/{locationId}/operating-hours")
    fun updateOperatingHours(
        @PathVariable businessAccountId: Long,
        @PathVariable locationId: Long,
        @RequestBody @Valid request: UpdateOperatingHoursRequest
    ): ResponseEntity<Set<com.cezar.core.application.dto.business.OperatingHourDTO>> {
        val hours = locationService.updateOperatingHours(businessAccountId, locationId, request)
        return ResponseEntity.ok(hours)
    }

    /**
     * Adaugă o fotografie nouă la o locație.
     * Requestul trebuie să fie de tip 'multipart/form-data'.
     */
//    @PostMapping("/{locationId}/photos", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
//    fun addPhoto(
//        @PathVariable businessAccountId: Long,
//        @PathVariable locationId: Long,
//        @RequestPart("file") file: MultipartFile,
//        @RequestPart("description", required = false) description: String?
//    ): ResponseEntity<LocationPhotoDTO> {
//        //val photo = locationService.addPhotoToLocation(businessAccountId, locationId, file, description)
//        //return ResponseEntity.status(HttpStatus.CREATED).body(photo)
//    }

    /**
     * Șterge o fotografie specifică de la o locație.
     */
    @DeleteMapping("/{locationId}/photos/{photoId}")
    fun deletePhoto(
        @PathVariable businessAccountId: Long,
        @PathVariable locationId: Long,
        @PathVariable photoId: Long
    ): ResponseEntity<Void> {
        //locationService.deleteLocationPhoto(businessAccountId, locationId, photoId)
        return ResponseEntity.noContent().build()
    }
}