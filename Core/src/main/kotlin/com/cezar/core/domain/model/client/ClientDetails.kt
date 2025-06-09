package com.cezar.core.domain.model.client

import com.cezar.core.domain.model.event.EventEntity
import com.cezar.core.domain.model.event.EventParticipation
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