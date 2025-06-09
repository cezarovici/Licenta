package com.cezar.core.dto

import jakarta.validation.constraints.NotBlank


data class CreateBusinessRequest(
    @field:NotBlank(message = "Business name is required")
    val name: String,

    val description: String?,
    val websiteUrl: String?,
    val phoneNumber: String?,
    val email: String?
)