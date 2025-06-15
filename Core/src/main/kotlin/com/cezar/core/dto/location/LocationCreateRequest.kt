package com.cezar.core.dto.location

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size

data class LocationCreateRequest(
    @field:NotBlank(message = "Numele locației este obligatoriu.")
    @field:Size(max = 255, message = "Numele locației nu poate depăși 255 de caractere.")
    val name: String,

    @field:NotBlank(message = "Adresa locației este obligatorie.")
    @field:Size(max = 500, message = "Adresa locației nu poate depăși 500 de caractere.")
    val address: String,

    // Câmpuri opționale
    val latitude: Double? = null,
    val longitude: Double? = null,

    // Acestea vor fi adăugate ulterior, dar le includem acum pentru structură
    // val photos: List<String>? = null, // URL-uri sau ID-uri pentru poze
    // val operatingHours: List<OperatingHourRequest>? = null,
    // val facilityIds: Set<Long>? = null // ID-urile facilităților existente
)