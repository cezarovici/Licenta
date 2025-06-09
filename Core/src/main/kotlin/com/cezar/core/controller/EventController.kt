package com.cezar.core.controller

import com.cezar.core.dto.CreateEventRequest
import com.cezar.core.dto.EventView
import com.cezar.core.service.EventService
import io.jsonwebtoken.Jwt
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
