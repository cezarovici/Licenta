package com.cezar.core.service

import com.cezar.core.client.UserManagementClient
import com.cezar.core.domain.model.client.ClientEntity
import com.cezar.core.dto.RegisterRequest
import com.cezar.core.dto.UserView
import com.cezar.core.repository.ClientRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ClientService(
    private val userManagementClient: UserManagementClient,
    private val clientRepository: ClientRepository
) {

    fun registerClient(request: RegisterRequest): UserView {
        return userManagementClient.registerClient(request)
    }

    // Metoda pentru uz intern (sincronizare)
    @Transactional
    fun findOrCreateByAuthServerUser(user: UserView): ClientEntity {
        return clientRepository.findById(user.id).orElseGet {
            val newClient = ClientEntity(
                id = user.id,
                firstName = user.firstName,
                lastName = user.lastName,
                email = user.email,
                profilePhotoUrl = "default_photo_url",
                password = "" // Parola nu se stochează aici
            )
            clientRepository.save(newClient)
        }
    }
}
