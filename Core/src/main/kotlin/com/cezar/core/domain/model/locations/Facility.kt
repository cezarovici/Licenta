package com.cezar.core.domain.model.locations

import com.cezar.core.application.dto.shared.FacilityDTO
import jakarta.persistence.*

@Entity
@Table(name = "facilities")
open class Facility(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, unique = true)
    var name: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    var location: LocationEntity? = null
){
    fun toDTO(): FacilityDTO = FacilityDTO(
        id = this.id!!,
        name = this.name
    )
}