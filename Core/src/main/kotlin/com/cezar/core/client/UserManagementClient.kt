package com.cezar.core.client

import com.cezar.core.dto.RegisterRequest
import com.cezar.core.dto.UserView
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody

interface UserManagementClient {

    @PostMapping("/signup")
    fun registerClient(@RequestBody request: RegisterRequest): UserView
}