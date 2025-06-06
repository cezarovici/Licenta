package com.cezar.core.entity.locations

import jakarta.persistence.*
import java.time.DayOfWeek
import java.time.LocalTime

@Entity
@Table(name = "operating_hours", schema = "core")
open class OperatingHour(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    var location: LocationEntity? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false)
    var dayOfWeek: DayOfWeek,

    @Column(name = "open_time", nullable = false)
    var openTime: LocalTime, // ex: 09:00

    @Column(name = "close_time", nullable = false)
    var closeTime: LocalTime // ex: 23:00
)