package com.cezar.core.application.dto.location

data class LocationSummaryDTO(
    val id: Long,
    val name: String,
    val address: String,
    val latitude: Double?,
    val longitude: Double?
)