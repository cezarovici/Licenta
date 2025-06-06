package com.cezar.core.entity.locations

import com.cezar.core.entity.business.BusinessEntity
import com.cezar.core.entity.event.EventEntity
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
    var business: BusinessEntity,

    @OneToMany(mappedBy = "location")
    var events: MutableSet<EventEntity> = mutableSetOf(),

    @OneToMany(mappedBy = "location", cascade = [CascadeType.ALL], orphanRemoval = true)
    var photos: MutableSet<LocationPhotos> = mutableSetOf(),

    @OneToMany(mappedBy = "location", cascade = [CascadeType.ALL], orphanRemoval = true)
    var operatingHours: MutableSet<OperatingHour> = mutableSetOf(),

    @ManyToMany(cascade = [CascadeType.PERSIST, CascadeType.MERGE])
    @JoinTable(
        name = "location_facilities",
        joinColumns = [JoinColumn(name = "location_id")],
        inverseJoinColumns = [JoinColumn(name = "facility_id")]
    )
    var facilities: MutableSet<Facility> = mutableSetOf(),

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
) {
    fun addPhoto(photo: LocationPhotos) {
        this.photos.add(photo)
        photo.location = this
    }

    fun addOperatingHour(hour: OperatingHour) {
        this.operatingHours.add(hour)
        hour.location = this
    }

    fun addFacility(facility: Facility) {
        this.facilities.add(facility)
    }
}