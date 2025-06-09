package com.cezar.core.dto

data class BusinessView(
    val id: Long,
    val accountId: Long,
    val name: String,
    val description: String?,
    val websiteUrl: String?,
    val phoneNumber: String?,
    val email: String?
)