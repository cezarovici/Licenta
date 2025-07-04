package com.cezar.core.application.dto.business

data class BusinessUpdateRequest(
        val name: String?,
        val logoUrl: String?,
        val description: String?,
        val websiteUrl: String?,
        val phoneNumber: String?,
        val email: String?
)
