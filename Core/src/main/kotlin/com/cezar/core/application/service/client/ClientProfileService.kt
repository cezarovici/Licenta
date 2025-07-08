package com.cezar.core.application.service.client

import com.cezar.core.application.dto.client.ClientProfileDTO
import com.cezar.core.application.dto.client.ClientProfileUpdateRequestDTO
import com.cezar.core.client.AuthServerClient
import com.cezar.core.common.UserTypeRepository
import com.cezar.core.domain.model.client.ClientEntity
import com.cezar.core.domain.repository.ClientRepository
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDateTime

@Service
class ClientProfileService(
    private val clientRepository: ClientRepository,
    private val userTypeRepository: UserTypeRepository,
    private val authServerClient: AuthServerClient
) {
    private val logger = LoggerFactory.getLogger(ClientProfileService::class.java)

    /**
     * READ: Obține profilul unui client.
     */
    @Transactional(readOnly = true)
    fun getClientProfile(accountId: Long): ClientProfileDTO {
        val clientEntity = clientRepository.findByAccountId(accountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "User profile not found for accountId: $accountId")

        val allEvents = clientEntity.participations.map { it.event!! }
        val now = LocalDateTime.now()

        val upcomingEvents = allEvents
            .filter { it.eventDateTime.isAfter(now) }
            .map { it.toSummaryDTO() }

        val pastEvents = allEvents
            .filter { it.eventDateTime.isBefore(now) }
            .map { it.toSummaryDTO() }


        return ClientProfileDTO(
            accountId = clientEntity.accountId,
            firstName = clientEntity.firstName,
            lastName = clientEntity.lastName,
            profilePhotoUrl = clientEntity.profilePhotoUrl,
            bio = clientEntity.details?.bio,
            favoriteSports = clientEntity.details?.favoriteSports,
            upcomingEvents = upcomingEvents,
            pastEvents = pastEvents
        )
    }

    /**
     * UPDATE: Actualizează profilul unui client.
     */
    @Transactional
    fun updateClientProfile(accountId: Long, request: ClientProfileUpdateRequestDTO): ClientProfileDTO {
        val clientEntity = findClientByAccountIdOrThrow(accountId)

        request.firstName?.let { clientEntity.firstName = it }
        request.lastName?.let { clientEntity.lastName = it }
        request.profilePhotoUrl?.let { clientEntity.profilePhotoUrl = it }
        request.bio?.let { clientEntity.details?.bio = it }
        request.favoriteSports?.let { clientEntity.details?.favoriteSports = it }

        val updatedClient = clientRepository.save(clientEntity)
        return getClientProfile(updatedClient.accountId) // Returnăm DTO-ul actualizat
    }

    /**
     * DELETE: Șterge complet un client din sistem.
     */
    fun deleteClientProfile(accountId: Long) {
        logger.info("Începe procesul de ștergere pentru clientul cu accountId: {}", accountId)

        if (!clientRepository.existsByAccountId(accountId)) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Profilul clientului nu a fost găsit.")
        }

        // Pas 1: Șterge datele locale (Client & UserType) într-o tranzacție
        deleteLocalClientData(accountId)

        // Pas 2: Șterge utilizatorul din AuthServer (acțiune de compensare)
        deleteUserInAuthService(accountId)

        logger.info("Procesul de ștergere pentru clientul cu accountId: {} a fost finalizat cu succes.", accountId)
    }

    @Transactional
    internal fun deleteLocalClientData(accountId: Long) {
        try {
            logger.info("Pasul 1: Se șterg datele locale pentru authId {}", accountId)
            clientRepository.deleteByAccountId(accountId)
            userTypeRepository.deleteById(accountId) // Presupunând că ID-ul e același
            logger.info("Pasul 1 REUȘIT: Datele locale pentru authId {} au fost șterse.", accountId)
        } catch (e: Exception) {
            logger.error("Pasul 1 EȘUAT: Nu s-au putut șterge datele locale pentru authId {}. Tranzacția va fi anulatā.", accountId, e)
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Eroare la ștergerea datelor locale ale clientului.", e)
        }
    }

    private fun deleteUserInAuthService(accountId: Long) {
        try {
            logger.warn("Pasul 2: Se încearcă ștergerea utilizatorului {} din AuthServer.", accountId)
            authServerClient.deleteUser(accountId)
            logger.info("Pasul 2 REUȘIT: Utilizatorul {} a fost șters din AuthServer.", accountId)
        } catch (e: Exception) {
            logger.error(
                "EROARE CRITICĂ: Acțiunea post-tranzacție a eșuat. " +
                        "Nu s-a putut șterge utilizatorul {} din AuthServer. Un utilizator orfan există acum.",
                accountId,
                e
            )
        }
    }

    private fun findClientByAccountIdOrThrow(accountId: Long): ClientEntity {
        return clientRepository.findByAccountId(accountId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "Profilul clientului nu a fost găsit pentru accountId: $accountId")
    }
}