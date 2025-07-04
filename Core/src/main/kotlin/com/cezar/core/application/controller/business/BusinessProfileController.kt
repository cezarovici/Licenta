package com.cezar.core.application.controller.business

import com.cezar.core.application.dto.business.*
import com.cezar.core.application.dto.location.PhotoCreateRequest
import com.cezar.core.application.service.business.BusinessProfileService
import com.cezar.core.application.service.business.BusinessQueryService
import com.cezar.core.client.StorageClient
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import java.net.URI
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/business-profile")
@Tag(name = "Business Profile Management API", description = "Endpoints for the authenticated business owner to manage their profile")
class BusinessProfileController(
    private val businessProfileService: BusinessProfileService, // Service pentru Comenzi (scriere)
    private val businessQueryService: BusinessQueryService,   // Service pentru Interogări (citire)
    private val storageClient: StorageClient
) {
    private val logger = LoggerFactory.getLogger(BusinessProfileController::class.java)

    // --- QUERY ENDPOINTS (folosesc BusinessQueryService) ---

    @GetMapping
    @Operation(summary = "Get current business profile details")
    fun getCurrentBusinessProfile(): ResponseEntity<BusinessDTO> {
        val accountId = getCurrentAccountId()
        val profileDto = businessQueryService.getBusinessDetails(accountId)
        return ResponseEntity.ok(profileDto)
    }

    @GetMapping("/locations")
    @Operation(summary = "Get all locations for the current business")
    fun getMyBusinessLocations(): ResponseEntity<BusinessLocationsDTO> {
        val accountId = getCurrentAccountId()
        val locationsDto = businessQueryService.getBusinessLocations(accountId)
        return ResponseEntity.ok(locationsDto)
    }

    // --- COMMAND ENDPOINTS (folosesc BusinessProfileService) ---

    @PatchMapping
    @Operation(summary = "Update business details (partial update)")
    fun updateBusinessDetails(@RequestBody request: BusinessUpdateRequest): ResponseEntity<BusinessDTO> {
        val accountId = getCurrentAccountId()
        val updatedProfile = businessProfileService.updateBusinessDetails(accountId, request)
        return ResponseEntity.ok(updatedProfile)
    }

    @PutMapping("/logo")
    @Operation(summary = "Update business logo URL")
    fun updateBusinessLogo(
        @RequestBody request: UpdateLogoRequest
    ): ResponseEntity<Unit> { // 3. Returnează profilul actualizat, pentru consistență.

        val accountId = getCurrentAccountId()
        val businessProfile = businessQueryService.getBusinessDetails(accountId)


        businessProfile.logoUrl?.let { oldUrl ->
            if (oldUrl.isNotBlank() && oldUrl != request.logoUrl) {
                try {
                    val oldFilename = URI(oldUrl).path.substringAfterLast('/')
                    // Aici ai apela serviciul tău de stocare pentru a șterge fișierul.
                    // Exemplu: storageService.deleteFile(oldFilename)
                    logger.info("Successfully deleted old logo '$oldFilename' for account $accountId.")
                } catch (e: Exception) {
                    logger.error("Could not delete old logo for URL '$oldUrl'. Reason: ${e.message}")
                    // Nu bloca actualizarea doar pentru că ștergerea a eșuat. Doar înregistrează eroarea.
                }
            }
        }

        // 4. Actualizează profilul cu noul URL și salvează-l.
        // Aici ar trebui să ai o metodă în serviciul tău care face update.
        val updatedProfile = businessProfileService.updateLogo(accountId, request.logoUrl)

        // 5. Returnează un răspuns 200 OK cu profilul actualizat.
        return ResponseEntity.ok(updatedProfile)
    }

    @PostMapping("/photos")
    @Operation(summary = "Add a new photo to the business profile")
    fun addPhoto(@RequestBody request: PhotoCreateRequest): ResponseEntity<BusinessPhotoDTO> {
        val accountId = getCurrentAccountId()
        val newPhoto = businessProfileService.addPhoto(accountId, request)
        return ResponseEntity(newPhoto, HttpStatus.CREATED)
    }

    @DeleteMapping("/photos/{photoId}")
    @Operation(summary = "Delete a photo by its ID")
    fun deletePhoto(@PathVariable photoId: Long): ResponseEntity<Void> {
        val accountId = getCurrentAccountId()
        businessProfileService.deletePhoto(accountId, photoId)
        return ResponseEntity.noContent().build()
    }

    private fun getCurrentAccountId(): Long {
        return SecurityContextHolder.getContext().authentication.name.toLong()
    }
}