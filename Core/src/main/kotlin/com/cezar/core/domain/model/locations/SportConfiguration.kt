package com.cezar.core.domain.model.locations

import com.cezar.core.application.dto.location.SportConfigurationDTO
import jakarta.persistence.*

@Entity
@Table(name = "location_sport_configurations")
class SportConfiguration(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    var location: LocationEntity,

    @Column(nullable = false)
    val sportName: String, // Ex: "Fotbal", "Tenis"

    @Column
    val surfaceType: String?, // Ex: "Gazon sintetic"

    @Column
    val recommendedCapacity: String?, // Ex: "5 vs 5"

    @Column
    val minBookingDuration: Int = 60, // Durata minimă în minute

    @Column
    val bookingSlotIncrement: Int = 30 // Saltul de rezervare în minute
){
    fun toDTO(): SportConfigurationDTO = SportConfigurationDTO(
        id = this.id,
        sportName = this.sportName,
        surfaceType = this.surfaceType,
        recommendedCapacity = this.recommendedCapacity,
        minBookingDuration = this.minBookingDuration,
        bookingSlotIncrement = this.bookingSlotIncrement
    )
}