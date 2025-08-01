package com.cezar.core.domain.model.locations

import com.cezar.core.application.dto.location.LocationPhotoDTO
import jakarta.persistence.*

@Entity
@Table(name = "location_photos")
open class LocationPhotos(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "photo_url", nullable = false)
    var photoUrl: String,

    @Column(nullable = true)
    var caption: String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    var location: LocationEntity? = null
){
    fun toDTO(): LocationPhotoDTO = LocationPhotoDTO(
        id = this.id!!,
        photoUrl = this.photoUrl,
        description = this.caption
    )
}