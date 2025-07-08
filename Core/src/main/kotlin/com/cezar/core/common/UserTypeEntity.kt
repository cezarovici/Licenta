package com.cezar.core.common

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

data class  UserTypeDTO(
    val accountId: Long,
    val name: String,
)

@Entity
@Table(name = "user_types")
data class UserTypeEntity(
    @Id
    @Column(name = "account_id")
    val accountId: Long,

    @Column(name = "user_type", nullable = false)
    val userType: String
){
    fun toDTO() : UserTypeDTO = UserTypeDTO(accountId, userType)
}