// Fișier nou: main/kotlin/com/cezar/core/domain/model/locations/PricingRule.kt

package com.cezar.core.domain.model.locations

import com.cezar.core.application.dto.location.PricingRuleDTO
import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalTime

@Entity
@Table(name = "location_pricing_rules")
class PricingRule(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    var location: LocationEntity,

    @Column(nullable = false)
    var ruleName: String,

    @ElementCollection(targetClass = String::class, fetch = FetchType.EAGER)
    @CollectionTable(name = "pricing_rule_days", joinColumns = [JoinColumn(name = "rule_id")])
    @Column(name = "day_of_week")
    var daysOfWeek: Set<String> = emptySet(), // Ex: "SATURDAY", "SUNDAY"

    @Column
    var startTime: LocalTime? = null, // Ex: 17:00

    @Column
    var endTime: LocalTime? = null,   // Ex: 23:00

    @Column(nullable = false)
    var pricePerHour: BigDecimal
){
    fun toDTO()  : PricingRuleDTO = PricingRuleDTO(
        id = this.id,
        ruleName = this.ruleName,
        daysOfWeek = this.daysOfWeek,
        startTime = this.startTime,
        endTime = this.endTime,
        pricePerHour = this.pricePerHour,
    )

}