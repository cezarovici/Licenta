package com.cezar.core.domain.model.locations

import com.cezar.core.application.dto.location.LocationPhotoDTO
import com.cezar.core.domain.model.business.BusinessEntity
import com.cezar.core.domain.model.event.EventEntity
import jakarta.persistence.*
import java.time.LocalDateTime

enum class CancellationPolicy {
    FLEXIBLE,
    MODERATE,
    STRICT
}

@Entity
@Table(name = "locations")
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

    // LAZY este o practică excelentă pentru performanță
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    var business: BusinessEntity,

    @OneToMany(mappedBy = "location")
    var events: MutableSet<EventEntity> = mutableSetOf(),

    @OneToMany(mappedBy = "location", cascade = [CascadeType.ALL], orphanRemoval = true)
    var photos: MutableSet<LocationPhotos> = mutableSetOf(),

    @OneToMany(mappedBy = "location", cascade = [CascadeType.ALL], orphanRemoval = true)
    var operatingHours: MutableSet<OperatingHour> = mutableSetOf(),

    @JoinTable(
        name = "location_facilities",
        joinColumns = [JoinColumn(name = "location_id")],
        inverseJoinColumns = [JoinColumn(name = "facility_id")]
    )

    @OneToMany
    var facilities: MutableSet<Facility> = mutableSetOf(),

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @OneToMany(mappedBy = "location", cascade = [CascadeType.ALL], orphanRemoval = true)
    var pricingRules: MutableSet<PricingRule> = mutableSetOf(),

    @OneToMany(mappedBy = "location", cascade = [CascadeType.ALL], orphanRemoval = true)
    var sportConfigurations: MutableSet<SportConfiguration> = mutableSetOf(),

    @Column(name = "max_booking_advance_days")
    var maxBookingAdvanceDays: Int? = 30,


    @Enumerated(EnumType.STRING)
    @Column(name = "cancellation_policy_type")
    var cancellationPolicy: CancellationPolicy = CancellationPolicy.MODERATE,
) {
    /**
     * Helper pentru a menține consistența relației bidirecționale cu LocationPhotos.
     */
    fun addPhoto(photo: LocationPhotos) {
        this.photos.add(photo)
        photo.location = this
    }

    /**
     * Helper pentru a menține consistența relației bidirecționale cu OperatingHour.
     */
    fun addOperatingHour(hour: OperatingHour) {
        this.operatingHours.add(hour)
        hour.location = this
    }

    fun addFacility(facility: Facility) {
        this.facilities.add(facility)
    }
}