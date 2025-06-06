package com.cezar.core.entity.business

import jakarta.persistence.*

@Entity
@Table(name = "business_photos", schema = "core")
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