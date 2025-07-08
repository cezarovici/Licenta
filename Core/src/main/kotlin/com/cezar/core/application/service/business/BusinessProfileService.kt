package com.cezar.core.application.service.business

import com.cezar.core.application.dto.business.BusinessDTO
import com.cezar.core.application.dto.business.BusinessUpdateRequest
import com.cezar.core.application.dto.business.BusinessPhotoDTO
import com.cezar.core.application.dto.location.PhotoCreateRequest
import com.cezar.core.domain.model.business.BusinessEntity
import com.cezar.core.domain.model.business.BusinessPhotoEntity
import com.cezar.core.domain.repository.BusinessRepository
import jakarta.persistence.EntityNotFoundException
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import org.springframework.http.HttpStatus

/**
 * Serviciu pentru gestionarea (Commands) profilului de business.
 * Conține exclusiv operațiuni de creare, modificare și ștergere.
 */
@Service
class BusinessProfileService(private val businessRepository: BusinessRepository) {
        private val logger = LoggerFactory.getLogger(BusinessProfileService::class.java)

        /**
         * Actualizează parțial detaliile de bază ale unui business.
         * Acționează ca o operație PATCH.
         */
        @Transactional
        fun updateBusinessDetails(accountId: Long, request: BusinessUpdateRequest): BusinessDTO {
                val business = findBusinessByAccountIdOrThrow(accountId)

                request.name?.let { business.businessName = it }
                request.description?.let { business.details?.description = it }
                request.websiteUrl?.let { business.details?.websiteUrl = it }
                request.phoneNumber?.let { business.details?.phoneNumber = it }
                request.email?.let { business.details?.email = it }
                request.logoUrl?.let{business.logoUrl = it}

                val savedBusiness = businessRepository.save(business)
                return savedBusiness.toDetailDTO()
        }

        /**
         * Actualizează logo-ul unui business.
         */
        @Transactional
        fun updateLogo(accountId: Long, newLogoUrl: String) {
                val business = findBusinessByAccountIdOrThrow(accountId)
                logger.info("Updating logo for business $accountId. New URL: $newLogoUrl")
                business.logoUrl = newLogoUrl
                businessRepository.save(business)
        }

        /**
         * Adaugă o fotografie nouă la profilul de business.
         */
        @Transactional
        fun addPhoto(accountId: Long, request: PhotoCreateRequest): BusinessPhotoDTO {
                val business = findBusinessByAccountIdOrThrow(accountId)
                logger.info("Adding new photo for business {}. URL: {}", accountId, request.url)

                val newPhoto = BusinessPhotoEntity(
                        photoUrl = request.url,
                        caption = request.description,
                        business = business
                )

                business.addPhoto(newPhoto)
                val savedBusiness = businessRepository.save(business)

                // Returnează DTO-ul ultimei fotografii adăugate
                return savedBusiness.photos.maxByOrNull { it.id ?: 0L }?.toDTO()
                        ?: throw IllegalStateException("Could not find the newly added photo for account $accountId")
        }

        /**
         * Șterge o fotografie din profilul de business pe baza ID-ului acesteia.
         */
        @Transactional
        fun deletePhoto(accountId: Long, photoId: Long) {
                val business = findBusinessByAccountIdOrThrow(accountId)
                val photoToDelete = business.photos.find { it.id == photoId }
                        ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Photo not found with ID: $photoId")

                business.removePhoto(photoToDelete)
                businessRepository.save(business)
        }

        private fun findBusinessByAccountIdOrThrow(accountId: Long): BusinessEntity {
                return businessRepository.findByAccountId(accountId)
                        ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Business not found for account ID: $accountId")
        }
}