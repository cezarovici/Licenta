package com.cezar.core.application.service.business

import com.cezar.core.application.dto.business.BusinessDTO
import com.cezar.core.application.dto.business.BusinessSummaryDTO
import com.cezar.core.application.dto.business.BusinessLocationsDTO
import com.cezar.core.domain.repository.BusinessRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException

/**
 * Serviciu dedicat interogărilor (Queries) pentru profilurile de business.
 */
@Service
class BusinessQueryService(private val businessRepository: BusinessRepository) {

    /** Obține o listă sumară a tuturor business-urilor. */
    @Transactional(readOnly = true)
    fun getAllBusinessesSummary(): List<BusinessSummaryDTO> {
        return businessRepository.findAll().map { it.toSummaryDTO() }
    }

    /** Obține profilul detaliat al unui business pe baza ID-ului de cont. */
    @Transactional(readOnly = true)
    fun getBusinessDetails(accountId: Long): BusinessDTO {
        val business = businessRepository.findByAccountId(accountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Business not found for account ID: $accountId")
        return business.toDetailDTO()
    }

    /** Obține locațiile unui business pe baza ID-ului de cont. */
    @Transactional(readOnly = true)
    fun getBusinessLocations(accountId: Long): BusinessLocationsDTO {
        val business = businessRepository.findByAccountId(accountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Business not found for account ID: $accountId")
        return business.toLocationsDTO()
    }
}