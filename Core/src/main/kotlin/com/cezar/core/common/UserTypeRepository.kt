package com.cezar.core.common

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserTypeRepository : JpaRepository<UserTypeEntity, Long> {
    fun findByAccountId(accountId: Long): UserTypeEntity?
}