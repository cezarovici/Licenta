package com.cezar.core.entity.event

import jakarta.persistence.*

@Entity
@Table(name = "event_photos", schema = "core")
open class EventPhotos(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "photo_url", nullable = false)
    var photoUrl: String,

    @Column(nullable = true)
    var caption: String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    var event: EventEntity? = null
)