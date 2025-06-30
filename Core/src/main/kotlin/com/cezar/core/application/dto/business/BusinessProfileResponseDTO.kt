package com.cezar.core.application.dto.business

class BusinessProfileResponseDTO(
    val businessName: String,

    // MODIFICAT: logoUrl poate fi null
    val logoUrl: String?,

    // MODIFICAT: details poate fi null
    val details: BusinessDetailsDTO,

    // MODIFICAT: Folosim liste de DTO-uri, nu entități
    val photos: MutableSet<BusinessPhotoDTO>,
    val locations: MutableSet<LocationDTO>
)