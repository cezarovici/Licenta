package com.cezar.core.application.dto.business

import com.cezar.core.application.dto.location.LocationSummaryDTO
import com.cezar.core.domain.model.business.BusinessDetails

data class UpdateLogoRequest(
        val logoUrl: String
)

data class BusinessDTO(
        val id: Long,
        val name: String,
        val logoUrl: String?,
        val photos: MutableSet<BusinessPhotoDTO>,
        val locations: Set<LocationSummaryDTO>,
        val description: String?,
        val websiteUrl: String?,
        val phoneNumber: String?,
        val email: String?
)

data class BusinessLocationsDTO(
        val id: Long,
        val businessName: String,
        val website: String?,
        val locations: Set<LocationSummaryDTO>
)