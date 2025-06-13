package com.cezar.core.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "security.gateway")
data class GatewaySecurityConfigProperties(
    var excludedPaths: List<String> = emptyList()
)