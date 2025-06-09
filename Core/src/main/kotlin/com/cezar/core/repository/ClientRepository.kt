package com.cezar.core.repository

import com.cezar.core.domain.model.client.ClientEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ClientRepository : JpaRepository<ClientEntity, Long> {
    fun findByEmail(email: String): ClientEntity?
}