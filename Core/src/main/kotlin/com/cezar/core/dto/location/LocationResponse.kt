package com.cezar.core.dto.location

data class LocationResponse(
    val id: Long,
    val name: String,
    val address: String,
    val latitude: Double?,
    val longitude: Double?,
    val businessId: Long,
    // Alte câmpuri pe care le vei adăuga pe măsură ce dezvolți
    // val photoUrls: List<String>,
    // val operatingHours: List<OperatingHourResponse>,
    // val facilities: List<FacilityResponse>
)