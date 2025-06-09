package com.cezar.core.domain.model.locations

import com.cezar.core.domain.model.business.BusinessEntity
import com.cezar.core.domain.model.event.EventEntity
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "locations", schema = "core")
open class LocationEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    var address: String,

    @Column
    var latitude: Double? = null,

    @Column
    var longitude: Double? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    var business: com.cezar.core.domain.model.business.BusinessEntity,

    @OneToMany(mappedBy = "location")
    var events: MutableSet<com.cezar.core.domain.model.event.EventEntity> = mutableSetOf(),

    @OneToMany(mappedBy = "location", cascade = [CascadeType.ALL], orphanRemoval = true)
    var photos: MutableSet<com.cezar.core.domain.model.locations.LocationPhotos> = mutableSetOf(),

    @OneToMany(mappedBy = "location", cascade = [CascadeType.ALL], orphanRemoval = true)
    var operatingHours: MutableSet<com.cezar.core.domain.model.locations.OperatingHour> = mutableSetOf(),

    @ManyToMany(cascade = [CascadeType.PERSIST, CascadeType.MERGE])
    @JoinTable(
        name = "location_facilities",
        joinColumns = [JoinColumn(name = "location_id")],
        inverseJoinColumns = [JoinColumn(name = "facility_id")]
    )
    var facilities: MutableSet<com.cezar.core.domain.model.locations.Facility> = mutableSetOf(),

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
) {
    fun addPhoto(photo: com.cezar.core.domain.model.locations.LocationPhotos) {
        this.photos.add(photo)
        photo.location = this
    }

    fun addOperatingHour(hour: com.cezar.core.domain.model.locations.OperatingHour) {
        this.operatingHours.add(hour)
        hour.location = this
    }

    fun addFacility(facility: com.cezar.core.domain.model.locations.Facility) {
        this.facilities.add(facility)
    }
}