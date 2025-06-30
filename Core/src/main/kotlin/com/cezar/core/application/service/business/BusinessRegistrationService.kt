package com.cezar.core.application.service.business

import com.cezar.core.client.AuthServerClient
import com.cezar.core.client.AuthUserDTO
import com.cezar.core.client.CreateAuthUserRequest
import com.cezar.core.application.controller.registration.CompleteBusinessRegistrationRequest
import com.cezar.core.domain.model.business.BusinessDetails
import com.cezar.core.domain.model.business.BusinessEntity
import com.cezar.core.domain.repository.BusinessRepository
import com.cezar.core.common.UserTypeRepository
import com.cezar.core.common.UserTypeEntity
import feign.FeignException
import org.slf4j.LoggerFactory
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.nio.charset.StandardCharsets
import java.time.LocalDateTime

@Service
class BusinessRegistrationService(
    private val authServerClient: AuthServerClient,
    private val businessRepository: BusinessRepository,
    private val userTypeRepository: UserTypeRepository
) {
    private val logger = LoggerFactory.getLogger(BusinessRegistrationService::class.java)

    /**
     * Orchestrează procesul de înregistrare a unei afaceri.
     * Pasul 1: Creează utilizatorul în serviciul de autentificare.
     * Pasul 2: Salvează profilul afacerii în baza de date locală (Core) și înregistrează tipul utilizatorului.
     * Dacă Pasul 2 eșuează, se inițiază o acțiune de compensare pentru a șterge utilizatorul creat la Pasul 1.
     */
    fun registerBusiness(request: CompleteBusinessRegistrationRequest) {
        logger.info("Starting business registration process for email: ${request.email}")
        val createdAuthUser = createUserInAuthService(request)

        try {
            saveLocalBusinessProfile(createdAuthUser.id, request)
        } catch (e: Exception) {
            // Dacă salvarea locală eșuează, compensăm prin ștergerea utilizatorului din AuthServer
            logger.error("Step 2 FAILED: Could not save local business profile or user type for authId ${createdAuthUser.id}. Initiating compensation.", e)
            compensateAuthUserCreation(createdAuthUser.id)

            // Aruncăm o excepție pentru a notifica clientul că procesul a eșuat
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save business profile after user creation.")
        }
        logger.info("Successfully completed business registration for email: ${request.email}")
    }

    /**
     * Gestionează crearea utilizatorului în AuthServer și tratează erorile specifice Feign.
     * Returnează DTO-ul utilizatorului creat sau aruncă o excepție `ResponseStatusException`.
     */
    private fun createUserInAuthService(request: CompleteBusinessRegistrationRequest): AuthUserDTO {
        logger.info("Step 1: Attempting to create user in AuthServer for email: ${request.email}")
        try {
            val createAuthUserRequest = CreateAuthUserRequest(
                email = request.email,
                username = request.email,
                password = request.password,
                authorities = setOf("BUSINESS") // Setează rolul corespunzător în AuthServer.
                // Acesta poate fi folosit de AuthServer pentru autorizare internă
                // sau pentru a decide ce claims să includă în JWT, dacă s-ar dori.
                // În arhitectura noastră actuală, user_type e în Core, nu în JWT de la IDM.
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
     * Salvează profilul complet al afacerii și înregistrează tipul utilizatorului în baza de date locală.
     * Această metodă este tranzacțională.
     */
    @Transactional
    internal fun saveLocalBusinessProfile(authUserId: Long, request: CompleteBusinessRegistrationRequest) {
        logger.info("Step 2: Saving local business profile and user type for authId $authUserId")
        try {
            val businessEntity = BusinessEntity(
                accountId = authUserId,
                businessName = request.businessName,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now(),
            )

            val details = BusinessDetails(
                description = request.businessDescription,
            )
            businessEntity.addDetails(details)


            businessRepository.save(businessEntity)
            logger.info("Sub-step 2.1 SUCCESS: Saved BusinessEntity for authId $authUserId")

            // <-- NOU: Salvarea tipului de utilizator în tabela user_types
            val userTypeEntry = UserTypeEntity(
                accountId = authUserId,
                userType = "BUSINESS" // <-- Valoare constantă pentru afaceri
            )
            userTypeRepository.save(userTypeEntry)
            logger.info("Sub-step 2.2 SUCCESS: Saved UserTypeEntity 'BUSINESS' for authId $authUserId")

            logger.info("Step 2 COMPLETE: Successfully saved local business profile and user type for authId $authUserId")

        } catch (e: DataIntegrityViolationException) {
            // Această excepție va prinde și conflictele de `accountId` în `BusinessEntity`
            // și în `UserTypeEntity` dacă accountId este PK.
            logger.error("Step 2 FAILED: Data integrity violation for authId $authUserId. Possibly duplicate accountId or profile.", e)
            throw ResponseStatusException(HttpStatus.CONFLICT, "A local profile or user type for this account already exists.")
        } catch (e: Exception) {
            logger.error("Step 2 FAILED: An unexpected error occurred while saving local business profile or user type for authId $authUserId.", e)
            throw e // Retașăm excepția pentru a fi prinsă de blocul catch superior (care declanșează compensarea)
        }
    }

    /**
     * Acțiune de compensare: șterge un utilizator din AuthServer.
     * Folosită când o tranzacție locală eșuează după ce utilizatorul a fost creat în AuthServer.
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

        }
    }
}