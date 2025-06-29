package com.cezar.core.domain.model.event

import com.cezar.core.application.dto.EventPhotoDTO
import jakarta.persistence.*

@Entity
@Table(name = "event_photos")
open class EventPhotos(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "photo_url", nullable = false)
    var photoUrl: String,

    @Column(nullable = true)
    var caption: String? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    var event: EventEntity? = null
){
    fun toDTO(): EventPhotoDTO {
        return EventPhotoDTO(
            id = this.id,
            photoUrl = this.photoUrl,
            caption = this.caption
        )
    }
}