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

/**
 * Serviciu pentru gestionarea operațiunilor legate de afaceri,
 * incluzând înregistrarea și ștergerea.
 */
@Service
class BusinessService(
    private val authServerClient: AuthServerClient,
    private val businessRepository: BusinessRepository,
    private val userTypeRepository: UserTypeRepository
) {
    private val logger = LoggerFactory.getLogger(BusinessService::class.java)

    /**
     * Orchestrează procesul de înregistrare a unei afaceri.
     */
    fun registerBusiness(request: CompleteBusinessRegistrationRequest) {
        logger.info("Starting business registration process for email: ${request.email}")
        val createdAuthUser = createUserInAuthService(request)

        try {
            saveLocalBusinessProfile(createdAuthUser.id, request)
        } catch (e: Exception) {
            logger.error("Step 2 FAILED: Could not save local business profile or user type for authId ${createdAuthUser.id}. Initiating compensation.", e)
            compensateAuthUserCreation(createdAuthUser.id)
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save business profile after user creation.")
        }
        logger.info("Successfully completed business registration for email: ${request.email}")
    }

    /**
     * Orchestrează procesul de ștergere a unei afaceri.
     * Pasul 1: Șterge profilul local al afacerii și tipul de utilizator (tranzacțional).
     * Pasul 2: Șterge utilizatorul din serviciul de autentificare.
     *
     * @param authUserId ID-ul utilizatorului din serviciul de autentificare.
     */
    public fun deleteBusiness(authUserId: Long) {
        logger.info("Starting business deletion process for authUserId: {}", authUserId)

        // Verificăm existența profilului pentru a putea returna un 404 Not Found clar.
        if (!businessRepository.existsByAccountId(authUserId)) {
            throw ResponseStatusException(HttpStatus.NOT_FOUND, "Business profile not found for the given user.")
        }

        // Pasul 1: Ștergerea datelor locale într-o singură tranzacție
        deleteLocalBusinessProfile(authUserId)

        // Pasul 2: Ștergerea utilizatorului din AuthServer (după ce tranzacția locală a avut succes)
        deleteUserInAuthService(authUserId)

        logger.info("Successfully completed business deletion for authUserId: {}", authUserId)
    }

    @Transactional
    internal fun deleteLocalBusinessProfile(authUserId: Long) {
        try {
            logger.info("Step 1: Deleting local business profile and user type for authId {}", authUserId)
            // Este important să ștergem în ordinea corectă dacă există constrângeri de chei străine.
            // Aici presupunem că putem șterge UserType fără a afecta BusinessEntity.
            businessRepository.deleteByAccountId(authUserId)
            logger.info("Step 1 SUCCESS: Local data deleted for authId {}", authUserId)
        } catch (e: Exception) {
            logger.error("Step 1 FAILED: Could not delete local data for authId {}. Transaction will be rolled back.", authUserId, e)
            // Aruncăm excepția pentru a opri procesul și a asigura rollback-ul tranzacției.
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete local business data.", e)
        }
    }

    /**
     * Acțiune de ștergere a utilizatorului din AuthServer.
     * Dacă această operațiune eșuează, se înregistrează o eroare critică.
     */
    private fun deleteUserInAuthService(authUserId: Long) {
        try {
            logger.warn("Step 2: Attempting to delete user {} from AuthServer.", authUserId)
            authServerClient.deleteUser(authUserId)
            logger.info("Step 2 SUCCESS: User {} deleted from AuthServer.", authUserId)
        } catch (e: Exception) {
            // EROARE CRITICĂ: Datele locale au fost șterse, dar utilizatorul a rămas în AuthServer.
            // Acest lucru necesită intervenție manuală sau un proces automat de curățare.
            logger.error(
                "CRITICAL FAILURE: Post-transaction action failed. " +
                        "Could not delete user {} from AuthServer. An orphan user now exists.",
                authUserId,
                e
            )
            // Nu aruncăm o excepție către client, deoarece resursa principală (profilul) a fost ștearsă cu succes.
        }
    }

    // --- Metodele existente pentru înregistrare (fără modificări) ---

    private fun createUserInAuthService(request: CompleteBusinessRegistrationRequest): AuthUserDTO {
        // ... implementarea existentă ...
        logger.info("Step 1: Attempting to create user in AuthServer for email: ${request.email}")
        try {
            val createAuthUserRequest = CreateAuthUserRequest(
                email = request.email,
                username = request.email,
                password = request.password,
                authorities = setOf("BUSINESS")
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

    @Transactional
    internal fun saveLocalBusinessProfile(authUserId: Long, request: CompleteBusinessRegistrationRequest) {
        // ... implementarea existentă ...
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

            val userTypeEntry = UserTypeEntity(
                accountId = authUserId,
                userType = "BUSINESS"
            )
            userTypeRepository.save(userTypeEntry)
            logger.info("Sub-step 2.2 SUCCESS: Saved UserTypeEntity 'BUSINESS' for authId $authUserId")

            logger.info("Step 2 COMPLETE: Successfully saved local business profile and user type for authId $authUserId")

        } catch (e: DataIntegrityViolationException) {
            logger.error("Step 2 FAILED: Data integrity violation for authId $authUserId. Possibly duplicate accountId or profile.", e)
            throw ResponseStatusException(HttpStatus.CONFLICT, "A local profile or user type for this account already exists.")
        } catch (e: Exception) {
            logger.error("Step 2 FAILED: An unexpected error occurred while saving local business profile or user type for authId $authUserId.", e)
            throw e
        }
    }

    private fun compensateAuthUserCreation(authUserId: Long) {
        // ... implementarea existentă ...
        try {
            logger.warn("COMPENSATION: Attempting to delete user $authUserId from AuthServer.")
            authServerClient.deleteUser(authUserId)
            logger.info("COMPENSATION: Successfully deleted user $authUserId.")
        } catch (e: Exception) {
            logger.error("CRITICAL FAILURE: Compensation transaction failed for authId $authUserId. Orphan user may exist in AuthServer.", e)
        }
    }
}
