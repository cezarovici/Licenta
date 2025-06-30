package com.cezar.core.common

import org.springframework.stereotype.Service


@Service
class UserTypeRetrievalService(
    private val userTypeRepository: UserTypeRepository
) {
    fun getUserType(accountId: Long): String? {
        return userTypeRepository.findByAccountId(accountId)?.userType
    }
}