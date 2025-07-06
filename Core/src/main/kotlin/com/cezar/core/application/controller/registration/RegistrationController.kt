package com.cezar.core.application.controller.registration

import com.cezar.core.application.service.business.BusinessService
import com.cezar.core.application.service.client.ClientRegistrationService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

data class CompleteClientRegistrationRequest(
    val firstName: String,
    val lastName: String,
    val email: String,
    val password: String,
    val profilePhotoUrl: String?,
    val bio: String?
)

data class CompleteBusinessRegistrationRequest(
    val firstName:String,
    val lastName:String,
    val email:String,
    val password:String,
    val businessName: String,
    val businessDescription: String,
    val locationName: String,
    val locationAddress: String
)

@RestController
@RequestMapping("/api/register")
class RegistrationController(
    private val clientRegistrationService: ClientRegistrationService,
    private val businessRegistrationService: BusinessService
) {
    private val logger = LoggerFactory.getLogger(RegistrationController::class.java)

    @PostMapping("/client")
    fun registerClient(@RequestBody request: CompleteClientRegistrationRequest): ResponseEntity<Void> {
        logger.info("Received client registration request for path: /api/register/client")
        logger.info("Client data received: {}", request)

        clientRegistrationService.registerClient(request)
        return ResponseEntity(HttpStatus.CREATED)
    }

    @PostMapping("/business")
    fun registerBusiness(@RequestBody request: CompleteBusinessRegistrationRequest): ResponseEntity<Void>{
        logger.info("Received business request for path: /api/register/business")
        logger.info("Business data received: {}", request)

        businessRegistrationService.registerBusiness(request)
        return ResponseEntity(HttpStatus.CREATED)
    }

    @DeleteMapping("/business/{businessId}")
    fun unregisterBusiness(@PathVariable businessId: Long): ResponseEntity<Void> {
        logger.info("Received business request for path: /api/unregister/business")
        businessRegistrationService.deleteBusiness(businessId)

        return ResponseEntity(HttpStatus.NO_CONTENT)
    }
}