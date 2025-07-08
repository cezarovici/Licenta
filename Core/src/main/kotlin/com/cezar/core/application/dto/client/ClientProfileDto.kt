package com.cezar.core.application.dto.client

import com.cezar.core.application.dto.EventSummaryDTO

data class ClientProfileDTO(
    val accountId: Long,
    val firstName: String,
    val lastName: String,
    val profilePhotoUrl: String,
    val bio: String?,
    val favoriteSports: String?,
    val upcomingEvents: List<EventSummaryDTO>,
    val pastEvents: List<EventSummaryDTO>
)