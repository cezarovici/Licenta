package com.cezar.core.service

import com.cezar.core.dto.BusinessProfileDTO // Asigură-te că ai acest DTO
import com.cezar.core.repository.BusinessRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class BusinessProfileService(
    private val businessRepository: BusinessRepository
) {
    fun getBusinessProfile(accountId: Long): BusinessProfileDTO {
        val businessEntity = businessRepository.findByAccountId(accountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Business profile not found for account ID: $accountId")


        val businessDescription = businessEntity.details?.description ?: "No business description provided."
        val businessEmail = businessEntity.details?.email ?: "No business email provided."
        val photoUrl = businessEntity.logoUrl ?: "default_business_logo_url"

        return BusinessProfileDTO(
            accountId = businessEntity.accountId,
            businessName = businessEntity.businessName,
            photoUrl = photoUrl,
            email = businessEmail,
            businessDescription = businessDescription,
        )
    }
}