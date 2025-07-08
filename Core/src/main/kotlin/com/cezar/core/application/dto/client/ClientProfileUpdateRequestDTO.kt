package com.cezar.core.application.dto.client


data class ClientProfileUpdateRequestDTO(
    val firstName: String?,
    val lastName: String?,
    val profilePhotoUrl: String?,
    val bio: String?,
    val favoriteSports: String?
)