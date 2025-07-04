package com.cezar.core.application.controller.business

import com.cezar.core.application.dto.business.BusinessDTO
import com.cezar.core.application.dto.business.BusinessSummaryDTO
import com.cezar.core.application.service.business.BusinessQueryService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/businesses")
class PublicBusinessController(private val businessQueryService: BusinessQueryService) {

    @GetMapping
    fun searchBusinesses(): ResponseEntity<List<BusinessSummaryDTO>> {
        val businesses = businessQueryService.getAllBusinessesSummary()
        return ResponseEntity.ok(businesses)
    }

    @GetMapping("/{id}")
    fun getBusinessById(@PathVariable id: Long): ResponseEntity<BusinessDTO> {
        // Aici ID-ul ar trebui să fie cel al entității Business, nu accountId
        // Va necesita o mică ajustare în BusinessQueryService (ex: findById)
        // Pentru simplitate, presupunem că getBusinessDetails acceptă și ID-ul de business
        // val business = businessQueryService.getBusinessDetails(id)
        // return ResponseEntity.ok(business)
        TODO("Implement find by business entity ID in query service")
    }
}