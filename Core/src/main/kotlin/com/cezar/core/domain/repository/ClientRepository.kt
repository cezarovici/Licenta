package com.cezar.core.domain.repository

import com.cezar.core.domain.model.client.ClientEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ClientRepository : JpaRepository<ClientEntity, Long> {
    fun findByAccountId(accountId: Long): ClientEntity?
    fun existsByAccountId(accountId: Long): Boolean
    fun deleteByAccountId(accountId: Long)
}