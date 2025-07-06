package com.cezar.core.domain.repository

import com.cezar.core.domain.model.business.BusinessEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface BusinessRepository : JpaRepository<BusinessEntity, Long> {
    fun findByAccountId(accountId: Long): BusinessEntity?
    fun existsByAccountId(accountId: Long): Boolean
    fun deleteByAccountId(accountId: Long) // Această metodă trebuie să fie tranzacțională
}