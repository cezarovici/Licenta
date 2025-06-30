package com.cezar.core.application.service.client

import com.cezar.core.application.dto.client.ClientProfileDTO
import com.cezar.core.domain.repository.ClientRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class ClientProfileService(
    private val clientRepository: ClientRepository
) {
    fun getClientProfile(accountId: Long): ClientProfileDTO {
        val clientEntity = clientRepository.findByAccountId(accountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "User profile not found for accountId: $accountId")

        return ClientProfileDTO(
            accountId = clientEntity.accountId,
            firstName = clientEntity.firstName,
            lastName = clientEntity.lastName,
            profilePhotoUrl = clientEntity.profilePhotoUrl,
            bio = clientEntity.details?.bio
        )
    }
}
