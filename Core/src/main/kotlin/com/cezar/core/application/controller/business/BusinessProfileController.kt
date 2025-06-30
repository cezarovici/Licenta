package com.cezar.core.application.controller.business

import com.cezar.core.application.dto.business.BusinessDetailDTO
import com.cezar.core.application.service.business.BusinessProfileService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/business-profile")
class BusinessProfileController(
    private val businessProfileService: BusinessProfileService
) {
    @GetMapping("/")
    fun getCurrentBusinessProfile(): ResponseEntity<BusinessDetailDTO> {
        val authentication = SecurityContextHolder.getContext().authentication
        val accountId = authentication.name.toLong()

        val profileDto = businessProfileService.getBusinessDetails(accountId)
        return ResponseEntity.ok(profileDto)
    }



}
