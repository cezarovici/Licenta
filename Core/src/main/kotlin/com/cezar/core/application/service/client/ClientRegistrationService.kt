package com.cezar.core.application.service.client

import com.cezar.core.client.AuthServerClient
import com.cezar.core.client.AuthUserDTO
import com.cezar.core.client.CreateAuthUserRequest
import com.cezar.core.application.controller.registration.CompleteClientRegistrationRequest
import com.cezar.core.common.UserTypeEntity
import com.cezar.core.common.UserTypeRepository
import com.cezar.core.domain.model.client.ClientDetails
import com.cezar.core.domain.model.client.ClientEntity
import com.cezar.core.domain.repository.ClientRepository
import feign.FeignException
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.nio.charset.StandardCharsets

@Service
class ClientRegistrationService(
    private val authServerClient: AuthServerClient,
    private val clientRepository: ClientRepository,
    private val userTypeRepository: UserTypeRepository
) {
    private val logger = LoggerFactory.getLogger(ClientRegistrationService::class.java)

    /**
     * Orchestrează procesul de înregistrare a unui client nou.
     */
    fun registerClient(request: CompleteClientRegistrationRequest) {
        logger.info("Starting client registration process for email: ${request.email}")
        // Pasul 1: Creează utilizatorul în serviciul de autentificare.
        val createdAuthUser = createUserInAuthService(request)

        // Pasul 2: Salvează profilul local, cu logică de compensare inclusă.
        try {
            saveLocalClientProfile(createdAuthUser.id, request)
        } catch (e: Exception) {
            logger.error("Step 2 FAILED: Could not save client profile locally for authId ${createdAuthUser.id}. Starting compensation.", e)
            compensateAuthUserCreation(createdAuthUser.id)
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User registration failed due to a profile creation error. Changes were rolled back.", e)
        }

        logger.info("Successfully registered new client with authId: ${createdAuthUser.id}")
    }

    /**
     * Gestionează crearea utilizatorului în AuthServer.
     */
    private fun createUserInAuthService(request: CompleteClientRegistrationRequest): AuthUserDTO {
        logger.info("Step 1: Attempting to create user in AuthServer for email: ${request.email}")
        try {
            val createAuthUserRequest = CreateAuthUserRequest(
                email = request.email,
                username = request.email, // Folosim email-ul ca username inițial
                password = request.password,
                authorities = setOf("CLIENT")
            )
            val authUser = authServerClient.createUser(createAuthUserRequest)
            logger.info("Step 1 SUCCESS: User created in AuthServer with ID: ${authUser.id}")
            return authUser
        } catch (e: FeignException.BadRequest) {
            val errorMessage = e.responseBody()
                .map { buffer -> StandardCharsets.UTF_8.decode(buffer).toString() }
                .orElse("A user with the given details already exists.")
            logger.error("Step 1 FAILED: AuthServer returned 400 Bad Request. Message: $errorMessage", e)
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, errorMessage)
        } catch (e: FeignException) {
            logger.error("Step 1 FAILED: A non-business error occurred with Auth Service.", e)
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not create user in Auth Service due to an unexpected error.")
        }
    }

    /**
     * Salvează profilul local al clientului într-o singură tranzacție.
     * Aici am completat TODO-urile cu valori logice.
     */
    @Transactional
    internal fun saveLocalClientProfile(authUserId: Long, request: CompleteClientRegistrationRequest) {
        logger.info("Sub-step 2.1: Creating ClientEntity for authId $authUserId")

        // Creăm entitatea Client cu valorile din request și valori implicite pentru câmpurile goale.
        val clientEntity = ClientEntity(
            accountId = authUserId,
            username = request.email, // Folosim email-ul ca username, consistent cu AuthServer
            firstName = request.firstName,
            lastName = request.lastName,
            profilePhotoUrl = request.profilePhotoUrl!!, // Poate fi null
            // id-ul este generat automat de bază de date, deci nu îl setăm aici
            // Relațiile (createdEvents, participations) sunt inițializate goale în entitate
        )

        // Adăugăm detaliile, dacă există
        if (request.bio != null) {
            val clientDetails = ClientDetails(bio = request.bio)
            clientEntity.addDetails(clientDetails)
        }

        clientRepository.save(clientEntity)
        logger.info("Sub-step 2.1 SUCCESS: ClientEntity saved for authId $authUserId")

        // Salvarea tipului de utilizator
        logger.info("Sub-step 2.2: Saving UserTypeEntity 'CLIENT' for authId $authUserId")
        val userTypeEntry = UserTypeEntity(
            accountId = authUserId,
            userType = "CLIENT"
        )
        userTypeRepository.save(userTypeEntry)
        logger.info("Sub-step 2.2 SUCCESS: UserTypeEntity 'CLIENT' saved for authId $authUserId")

        logger.info("Step 2 COMPLETE: Successfully saved local client profile and user type for authId $authUserId")
    }

    /**
     * Tranzacție de compensare.
     */
    private fun compensateAuthUserCreation(authUserId: Long) {
        try {
            logger.warn("COMPENSATION: Attempting to delete user $authUserId from AuthServer.")
            authServerClient.deleteUser(authUserId)
            logger.info("COMPENSATION: Successfully deleted user $authUserId.")
        } catch (e: Exception) {
            logger.error("CRITICAL FAILURE: Compensation transaction failed for authId $authUserId. Orphan user may exist in AuthServer.", e)
            // Aici ar trebui să existe un sistem de alertare pentru intervenție manuală.
        }
    }
}