// Fișier nou: main/kotlin/com/cezar/core/domain/repository/PricingRuleRepository.kt
package com.cezar.core.domain.repository

import com.cezar.core.domain.model.locations.PricingRule
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PricingRuleRepository : JpaRepository<PricingRule, Long>

