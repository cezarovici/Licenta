package com.cezar.core.domain.model.event

import com.cezar.core.domain.model.client.ClientEntity
import com.cezar.core.domain.model.locations.LocationEntity
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "events")
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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var type: com.cezar.core.domain.model.event.EventType,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: EventStatus = EventStatus.PLANNED,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    var creator:ClientEntity,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    var location: LocationEntity,

    @OneToOne(mappedBy = "event", cascade = [CascadeType.ALL], fetch = FetchType.LAZY, optional = false)
    var details: EventDetails? = null,

    @OneToMany(mappedBy = "event", cascade = [CascadeType.ALL], orphanRemoval = true)
    var participations: MutableSet<EventParticipation> = mutableSetOf(),

    @OneToMany(mappedBy = "event", cascade = [CascadeType.ALL], orphanRemoval = true)
    var photos: MutableSet<EventPhotos> = mutableSetOf()
) {
    fun addDetails(details: EventDetails) {
        this.details = details
        details.event = this
    }

    fun addParticipation(participation: EventParticipation) {
        this.participations.add(participation)
        participation.event = this
    }

    fun removeParticipation(participation:EventParticipation) {
        this.participations.remove(participation)
        participation.event = null
    }

    fun addPhoto(photo: EventPhotos) {
        this.photos.add(photo)
        photo.event = this
    }
}