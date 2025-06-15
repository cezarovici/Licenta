package com.cezar.core.controller

import com.cezar.core.dto.BusinessProfileDTO // Va trebui să creezi acest DTO
import com.cezar.core.service.BusinessProfileService // Va trebui să creezi acest Service
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/business-profile") // Mapping specific pentru business
class BusinessProfileController(
    private val businessProfileService: BusinessProfileService
) {

    @GetMapping("/me")
    fun getCurrentBusinessProfile(@RequestHeader("X-User-Id") accountId: Long): ResponseEntity<BusinessProfileDTO> {
        val profileDto = businessProfileService.getBusinessProfile(accountId)
        return ResponseEntity.ok(profileDto)
    }

}