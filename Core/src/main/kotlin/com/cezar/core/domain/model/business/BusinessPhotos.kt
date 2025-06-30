package com.cezar.core.domain.model.business

import com.cezar.core.application.dto.business.BusinessPhotoDTO
import jakarta.persistence.*

@Entity
@Table(name = "business_photos")
open class BusinessPhotoEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, name = "photo_url")
    var photoUrl: String,

    @Column(nullable = true)
    var caption: String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    var business: BusinessEntity? = null
)
{
    fun toDTO(isPrimary: Boolean = false): BusinessPhotoDTO {
        return BusinessPhotoDTO(
            id = this.id!!,
            photoUrl = this.photoUrl,
            description = this.caption,
            isPrimary = isPrimary
        )
    }
}