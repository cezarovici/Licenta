package com.cezar.core.dto

data class BusinessProfileDTO (
    val accountId: Long,
    val businessName: String,
    val email: String,
    val photoUrl: String,
    val businessDescription: String,
)