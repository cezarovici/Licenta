package com.cezar.core.application.dto.business

import com.cezar.core.application.dto.location.LocationSummaryDTO

/**
 * DTO Sumar: Perfect pentru a afișa o listă de parteneri sau sponsori.
 * Conține doar informațiile de bază pentru identificare vizuală rapidă.
 */
data class BusinessSummaryDTO(
    val businessName: String,
    val logoUrl: String?
)

/**
 * DTO Detaliat: O redenumire a lui BusinessProfileResponseDTO pentru claritate.
 * Oferă profilul complet, ideal pentru pagina dedicată unui business.
 */
data class BusinessDetailDTO(
    val businessName: String,
    val logoUrl: String?,
    val details: BusinessDetailsDTO,
    val photos: Set<BusinessPhotoDTO>,
    val locations: Set<LocationSummaryDTO> // Afișăm doar un sumar al locațiilor aici
)

/**
 * DTO specializat pentru locații: Afișează informații de bază despre business
 * și o listă detaliată a locațiilor sale.
 */
data class BusinessLocationsDTO(
    val businessName: String,
    val website: String?, // Adăugăm un câmp relevant, ex: website-ul
    val locations: Set<LocationSummaryDTO>
)