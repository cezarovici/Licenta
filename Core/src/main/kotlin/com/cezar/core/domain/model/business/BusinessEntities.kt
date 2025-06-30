package com.cezar.core.domain.model.business

import com.cezar.core.application.dto.business.BusinessDetailDTO
import com.cezar.core.application.dto.business.BusinessLocationsDTO
import com.cezar.core.application.dto.business.BusinessSummaryDTO
import com.cezar.core.application.service.location.toSummaryDTO
import com.cezar.core.domain.model.locations.LocationEntity
import jakarta.persistence.*
import java.time.LocalDateTime
@Entity
@Table(name = "business")
open class BusinessEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, name = "account_id")
    val accountId: Long,

    @Column(nullable = false)
    var businessName: String,

    @Column(nullable = true, name = "logo_url")
    var logoUrl: String? = null,

    @Column(nullable = false, name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false, name = "updated_at")
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @OneToOne(mappedBy = "business", cascade = [CascadeType.ALL], fetch = FetchType.LAZY, optional = false)
    var details: BusinessDetails? = null,

    @OneToMany(mappedBy = "business", cascade = [CascadeType.ALL], orphanRemoval = true)
    var photos: MutableSet<BusinessPhotoEntity> = mutableSetOf(),

    @OneToMany(mappedBy = "business", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var locations: MutableSet<LocationEntity> = mutableSetOf(),
) {
    fun toSummaryDTO(): BusinessSummaryDTO {
        return BusinessSummaryDTO(
            businessName = this.businessName,
            logoUrl = this.logoUrl
        )
    }

    fun toDetailDTO(): BusinessDetailDTO {
        return BusinessDetailDTO(
            businessName = this.businessName,
            logoUrl = this.logoUrl,
            details = this.details!!.toDTO(),
            photos = this.photos.map { it.toDTO() }.toSet(),
            locations = this.locations.map { it.toSummaryDTO() }.toSet()
        )
    }

    fun toLocationsDTO(): BusinessLocationsDTO {
        return BusinessLocationsDTO(
            businessName = this.businessName,
            website = this.details?.websiteUrl,
            locations = this.locations.map { it.toSummaryDTO() }.toSet()
        )
    }

    fun addDetails(details: BusinessDetails) {
        this.details = details
        details.business = this
    }

    fun addPhoto(photo: BusinessPhotoEntity) {
        photos.add(photo)
        photo.business = this
    }

    fun addLocation(location: LocationEntity) {
        locations.add(location)
    }

    fun removePhoto(photo: BusinessPhotoEntity) {
        photos.remove(photo)
        photo.business = null
    }
}