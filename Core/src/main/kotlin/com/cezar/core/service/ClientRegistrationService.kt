package com.cezar.core.service

import com.cezar.core.client.AuthServerClient
import com.cezar.core.client.AuthUserDTO
import com.cezar.core.client.CreateAuthUserRequest
import com.cezar.core.controller.CompleteClientRegistrationRequest
import com.cezar.core.domain.model.client.ClientDetails
import com.cezar.core.domain.model.client.ClientEntity
import com.cezar.core.repository.ClientRepository
import com.cezar.core.repository.UserTypeRepository // <-- NOU: Importă UserTypeRepository
import com.cezar.core.domain.model.UserTypeEntity // <-- NOU: Importă UserTypeEntity (asigură-te că pachetul este corect)
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
     * Pasul 1: Creează utilizatorul în serviciul de autentificare.
     * Pasul 2: Salvează profilul local. Dacă acest pas eșuează, se inițiază compensarea.
     */
    fun registerClient(request: CompleteClientRegistrationRequest) {
        logger.info("Starting client registration process for email: ${request.email}")
        // Pasul 1: Creează utilizatorul în serviciul de autentificare.
        // Această funcție va arunca o excepție `ResponseStatusException` dacă eșuează, oprind fluxul.
        val createdAuthUser = createUserInAuthService(request)

        // Pasul 2: Salvează profilul local, cu logică de compensare inclusă.
        // Această funcție va arunca o excepție dacă eșuează, după ce încearcă să compenseze.
        saveClientProfileWithCompensation(createdAuthUser, request)

        logger.info("Successfully registered new client with authId: ${createdAuthUser.id}")
    }

    /**
     * Gestionează crearea utilizatorului în AuthServer și tratează erorile specifice Feign.
     * Returnează DTO-ul utilizatorului creat sau aruncă o excepție `ResponseStatusException`.
     */
    private fun createUserInAuthService(request: CompleteClientRegistrationRequest): AuthUserDTO {
        logger.info("Step 1: Attempting to create user in AuthServer for email: ${request.email}")
        try {
            val createAuthUserRequest = CreateAuthUserRequest(
                email = request.email,
                username = request.email,
                password = request.password,
                authorities = setOf("CLIENT") // Setează rolul corespunzător în AuthServer
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
        } catch (e: FeignException) { // Prindem alte erori Feign (ex: 500, 404)
            logger.error("Step 1 FAILED: A non-business error occurred with Auth Service.", e)
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not create user in Auth Service due to an unexpected error.")
        }
    }

    /**
     * Salvează profilul local al clientului. Dacă salvarea eșuează,
     * inițiază o tranzacție de compensare pentru a șterge utilizatorul din AuthServer.
     */
    private fun saveClientProfileWithCompensation(createdAuthUser: AuthUserDTO, request: CompleteClientRegistrationRequest) {
        try {
            logger.info("Step 2: Attempting to create local profile and user type for authUserId: ${createdAuthUser.id}")
            saveLocalClientProfile(createdAuthUser.id, request)
        } catch (e: Exception) {
            logger.error("Step 2 FAILED: Could not save client profile or user type locally for authId ${createdAuthUser.id}. Starting compensation.", e)
            compensateAuthUserCreation(createdAuthUser.id)
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User registration failed due to a profile creation error. Changes were rolled back.", e)
        }
    }

    /**
     * Tranzacție de compensare: încearcă să șteargă utilizatorul creat în AuthServer.
     */
    private fun compensateAuthUserCreation(authUserId: Long) {
        try {
            logger.warn("COMPENSATION: Attempting to delete user $authUserId from AuthServer.")
            authServerClient.deleteUser(authUserId)
            logger.info("COMPENSATION: Successfully deleted user $authUserId.")
        } catch (e: Exception) {
            // Această eroare este critică. Trebuie logată cu prioritate maximă.
            // Utilizatorul a fost creat în AuthServer, dar nu și local, și compensarea a eșuat.
            logger.error("CRITICAL FAILURE: Compensation transaction failed for authId $authUserId. Orphan user may exist in AuthServer.", e)
            // Aici ar trebui să notifici un sistem de alertare pentru intervenție manuală.
        }
    }

    @Transactional
    internal fun saveLocalClientProfile(authUserId: Long, request: CompleteClientRegistrationRequest) {
        logger.info("Sub-step 2.1: Saving ClientEntity for authId $authUserId")
        val clientEntity = ClientEntity(
            accountId = authUserId,
            firstName = request.firstName,
            lastName = request.lastName,
            profilePhotoUrl = request.profilePhotoUrl ?: "default_url"
        )
        val clientDetails = ClientDetails(bio = request.bio)
        clientEntity.addDetails(clientDetails)
        clientRepository.save(clientEntity)
        logger.info("Sub-step 2.1 SUCCESS: ClientEntity saved for authId $authUserId")

        // <-- NOU: Salvarea tipului de utilizator în tabela user_types
        logger.info("Sub-step 2.2: Saving UserTypeEntity 'CLIENT' for authId $authUserId")
        val userTypeEntry = UserTypeEntity(
            accountId = authUserId,
            userType = "CLIENT" // <-- Valoare constantă pentru clienți
        )
        userTypeRepository.save(userTypeEntry)
        logger.info("Sub-step 2.2 SUCCESS: UserTypeEntity 'CLIENT' saved for authId $authUserId")

        logger.info("Step 2 COMPLETE: Successfully saved local client profile and user type for authId $authUserId")
    }
}