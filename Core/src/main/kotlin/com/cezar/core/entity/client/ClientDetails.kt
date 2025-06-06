package com.cezar.core.entity.client

import com.cezar.core.entity.event.EventEntity
import com.cezar.core.entity.event.EventParticipation
import jakarta.persistence.*

@Entity
@Table(name = "client_details", schema = "core")
class ClientDetails(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Lob
    var bio: String? = null,

    @OneToMany(mappedBy = "client", cascade = [CascadeType.ALL], orphanRemoval = true)
    var photos: MutableSet<ClientPhotoEntity> = mutableSetOf(),

    @OneToMany(mappedBy = "creator")
    var createdEvents: MutableSet<EventEntity> = mutableSetOf(),

    @OneToMany(mappedBy = "client")
    var participations: MutableSet<EventParticipation> = mutableSetOf(),
){

}