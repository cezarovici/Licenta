package com.cezar.core.application.service.business

import com.cezar.core.application.dto.business.BusinessDetailDTO
import com.cezar.core.application.dto.business.BusinessLocationsDTO
import com.cezar.core.application.dto.business.BusinessSummaryDTO
import com.cezar.core.client.AuthServerClient
import com.cezar.core.common.UserTypeRepository
import com.cezar.core.domain.repository.BusinessRepository
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException

@Service
class BusinessProfileService(
    private val businessRepository: BusinessRepository,
    private val userTypeRepository: UserTypeRepository,
    private val authServerClient: AuthServerClient
) {
    private val logger = LoggerFactory.getLogger(BusinessProfileService::class.java)

    /**
     * Obține o listă sumară a tuturor business-urilor.
     */
    @Transactional(readOnly = true)
    fun getAllBusinessesSummary(): List<BusinessSummaryDTO> {
        return businessRepository.findAll().map { it.toSummaryDTO() }
    }

    /**
     * Obține profilul detaliat al unui business pe baza ID-ului de cont.
     */
    @Transactional(readOnly = true)
    fun getBusinessDetails(accountId: Long): BusinessDetailDTO {
        val business = businessRepository.findByAccountId(accountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Business not found for account ID: $accountId")
        return business.toDetailDTO() // Folosim metoda de conversie actualizată
    }

    /**
     * Obține locațiile unui business pe baza ID-ului de cont.
     */
    @Transactional(readOnly = true)
    fun getBusinessLocations(accountId: Long): BusinessLocationsDTO {
        val business = businessRepository.findByAccountId(accountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Business not found for account ID: $accountId")
        return business.toLocationsDTO()
    }
}