package com.cezar.core.domain.model.event

import com.cezar.core.application.dto.EventParticipationDTO
import com.cezar.core.domain.model.client.ClientEntity
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(
    name = "event_participations",
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
){
    fun toDTO(): EventParticipationDTO {
        return EventParticipationDTO(
            client = this.client.toDTO(),
            joinDateTime = this.joinDateTime
        )
    }
}