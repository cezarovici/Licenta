package com.cezar.core.repository

import com.cezar.core.domain.model.UserTypeEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserTypeRepository : JpaRepository<UserTypeEntity, Long> {
    fun findByAccountId(accountId: Long): UserTypeEntity?
}