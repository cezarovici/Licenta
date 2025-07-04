package com.cezar.core.application.dto.business

data class BusinessPhotoDTO(
        val id: Long,
        val photoUrl: String,
        val description: String?,
        val isPrimary: Boolean
)
