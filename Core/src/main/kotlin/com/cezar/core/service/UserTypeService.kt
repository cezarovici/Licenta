package com.cezar.core.service

import com.cezar.core.repository.UserTypeRepository
import org.springframework.stereotype.Service
import org.springframework.data.jpa.repository.JpaRepository
import jakarta.persistence.*
import org.springframework.stereotype.Repository





@Service
class UserTypeRetrievalService(
    private val userTypeRepository: UserTypeRepository
) {
    fun getUserType(accountId: Long): String? {
        return userTypeRepository.findByAccountId(accountId)?.userType
    }
}