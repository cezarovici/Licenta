package com.cezar.core.entity.event

import com.cezar.core.entity.client.ClientEntity
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(
    name = "event_participations", schema = "core",
    uniqueConstraints = [UniqueConstraint(columnNames = ["event_id", "client_id"])]
)
open class EventParticipation(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    var event: EventEntity? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    var client: ClientEntity,

    @Column(name = "join_date_time", nullable = false, updatable = false)
    val joinDateTime: LocalDateTime = LocalDateTime.now()
)