package com.cezar.core.application.controller.registration

import com.cezar.core.application.service.business.BusinessRegistrationService
import com.cezar.core.application.service.client.ClientRegistrationService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.slf4j.LoggerFactory

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
    private val businessRegistrationService: BusinessRegistrationService
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
}