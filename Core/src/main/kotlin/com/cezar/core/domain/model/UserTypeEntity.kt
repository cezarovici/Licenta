package com.cezar.core.domain.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "user_types")
data class UserTypeEntity(
    @Id
    @Column(name = "account_id")
    val accountId: Long,

    @Column(name = "user_type", nullable = false)
    val userType: String
)