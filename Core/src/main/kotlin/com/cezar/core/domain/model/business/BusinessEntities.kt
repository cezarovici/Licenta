package com.cezar.core.domain.model.business

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
    var name: String,

    @Column(nullable = true, name = "logo_url")
    var logoUrl: String? = null,

    @Column(nullable = false, name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(nullable = false, name = "updated_at")
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @OneToOne(mappedBy = "business", cascade = [CascadeType.ALL], fetch = FetchType.LAZY, optional = false)
    var details: BusinessDetails? = null,

    @OneToMany(mappedBy = "business", cascade = [CascadeType.ALL], orphanRemoval = true)
    var photos: MutableSet<BusinessPhotoEntity> = mutableSetOf()
) {
    fun addDetails(details: BusinessDetails) {
        this.details = details
        details.business = this
    }

    fun addPhoto(photo: BusinessPhotoEntity) {
        photos.add(photo)
        photo.business = this
    }

    fun removePhoto(photo: BusinessPhotoEntity) {
        photos.remove(photo)
        photo.business = null
    }
}