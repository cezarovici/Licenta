package com.cezar.core.domain.repository

import com.cezar.core.domain.model.locations.SportConfiguration
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SportConfigurationRepository : JpaRepository<SportConfiguration, Long>