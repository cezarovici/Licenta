package com.cezar.core.domain.model.event

import com.cezar.core.domain.model.client.ClientEntity
import com.cezar.core.domain.model.locations.LocationEntity
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "events", schema = "core")
open class EventEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    var title: String,

    @Column(nullable = false)
    var sport: String,

    @Column(name = "event_date_time", nullable = false)
    var eventDateTime: LocalDateTime,
    // Câmpul nou care face distincția între public și privat

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var type: com.cezar.core.domain.model.event.EventType,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: com.cezar.core.domain.model.event.EventStatus = com.cezar.core.domain.model.event.EventStatus.PLANNED,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    var creator: com.cezar.core.domain.model.client.ClientEntity,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    var location: com.cezar.core.domain.model.locations.LocationEntity,

    @OneToOne(mappedBy = "event", cascade = [CascadeType.ALL], fetch = FetchType.LAZY, optional = false)
    var details: com.cezar.core.domain.model.event.EventDetails? = null,

    @OneToMany(mappedBy = "event", cascade = [CascadeType.ALL], orphanRemoval = true)
    var participations: MutableSet<com.cezar.core.domain.model.event.EventParticipation> = mutableSetOf(),

    @OneToMany(mappedBy = "event", cascade = [CascadeType.ALL], orphanRemoval = true)
    var photos: MutableSet<com.cezar.core.domain.model.event.EventPhotos> = mutableSetOf()
) {
    fun addDetails(details: com.cezar.core.domain.model.event.EventDetails) {
        this.details = details
        details.event = this
    }

    fun addParticipation(participation: com.cezar.core.domain.model.event.EventParticipation) {
        this.participations.add(participation)
        participation.event = this
    }

    fun removeParticipation(participation: com.cezar.core.domain.model.event.EventParticipation) {
        this.participations.remove(participation)
        participation.event = null
    }

    fun addPhoto(photo: com.cezar.core.domain.model.event.EventPhotos) {
        this.photos.add(photo)
        photo.event = this
    }
}