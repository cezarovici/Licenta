package com.cezar.core.application.dto.client

data class ClientProfileDTO(
    val accountId: Long,
    val firstName: String,
    val lastName: String,
    val profilePhotoUrl: String,
    val bio: String?
)