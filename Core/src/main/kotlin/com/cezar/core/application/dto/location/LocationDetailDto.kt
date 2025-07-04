package com.cezar.core.application.dto.location

import com.cezar.core.application.dto.business.BusinessLocationsDTO
import com.cezar.core.application.dto.shared.FacilityDTO

data class LocationDetailDTO(
    val id: Long,
    val name: String,
    val address: String,
    val latitude: Double?,
    val longitude: Double?,
    val business: BusinessLocationsDTO,
    val photos: Set<LocationPhotoDTO>,
    val operatingHours: Set<OperatingHourDTO>,
    val facilities: Set<FacilityDTO>,
    val upcomingEventsCount: Int
)
