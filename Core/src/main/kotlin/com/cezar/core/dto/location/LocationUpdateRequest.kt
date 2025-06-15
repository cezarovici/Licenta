package com.cezar.core.dto.location

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class LocationUpdateRequest(
    @field:NotBlank(message = "Numele locației este obligatoriu.")
    @field:Size(max = 255, message = "Numele locației nu poate depăși 255 de caractere.")
    val name: String,

    @field:NotBlank(message = "Adresa locației este obligatorie.")
    @field:Size(max = 500, message = "Adresa locației nu poate depăși 500 de caractere.")
    val address: String,

    val latitude: Double? = null,
    val longitude: Double? = null,
)