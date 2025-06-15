package com.cezar.core.repository

import com.cezar.core.domain.model.business.BusinessEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface BusinessRepository : JpaRepository<BusinessEntity, Long> {
    fun findByAccountId(accountId: Long): BusinessEntity?
}