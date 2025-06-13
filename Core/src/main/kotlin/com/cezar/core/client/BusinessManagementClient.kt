package com.cezar.core.client

import com.cezar.core.dto.BusinessView
import com.cezar.core.dto.CreateBusinessRequest
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader

interface BusinessManagementClient {

    @PostMapping
    fun createBusiness(
        @RequestBody request: CreateBusinessRequest,
        @RequestHeader("Authorization") token: String
    ): BusinessView
}