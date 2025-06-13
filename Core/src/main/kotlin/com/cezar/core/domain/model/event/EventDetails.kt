package com.cezar.core.domain.model.event

import jakarta.persistence.*
import java.math.BigDecimal

@Entity
@Table(name = "event_details")
open class EventDetails(
    @Id
    var id: Long? = null,

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "event_id")
    var event: EventEntity? = null,

    @Lob
    var description: String? = null,

    @Column(name = "max_participants")
    var maxParticipants: Int? = null,

    @Column(name = "cost_per_person")
    var costPerPerson: BigDecimal = BigDecimal.ZERO,

    @Enumerated(EnumType.STRING)
    @Column(name = "skill_level", nullable = false)
    var skillLevel: SkillLevel = SkillLevel.ALL_LEVELS
)