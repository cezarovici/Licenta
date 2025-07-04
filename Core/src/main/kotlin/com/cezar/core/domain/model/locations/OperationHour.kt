package com.cezar.core.domain.model.locations

import com.cezar.core.application.dto.location.OperatingHourDTO
import jakarta.persistence.*
import java.time.LocalTime

@Entity
@Table(name = "operating_hours")
open class OperatingHour(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    var location: LocationEntity? = null,

    @Column(name = "day_of_week", nullable = false)
    var dayOfWeek: String,

    @Column(name = "open_time", nullable = false)
    var openTime: LocalTime,

    @Column(name = "close_time", nullable = false)
    var closeTime: LocalTime
){

    fun toDTO(): OperatingHourDTO = OperatingHourDTO(
        dayOfWeek = this.dayOfWeek,
        openTime = this.openTime,
        closeTime = this.closeTime
    )
}