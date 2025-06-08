package com.cezar.core.entities.client

import com.cezar.core.entities.event.EventEntity
import com.cezar.core.entities.event.EventParticipation
import jakarta.persistence.*

@Entity
@Table(name = "client_details", schema = "core")
class ClientDetails(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Lob
    var bio: String? = null,
){

}