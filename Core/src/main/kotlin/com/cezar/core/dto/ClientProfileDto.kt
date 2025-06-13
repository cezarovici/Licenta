package com.cezar.core.dto
data class ClientProfileDTO(
    val accountId: Long,
    val firstName: String,
    val lastName: String,
    val profilePhotoUrl: String,
    val bio: String?
)