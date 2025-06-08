package com.cezar.core.entities.client

import jakarta.persistence.*

@Entity
@Table(name = "client_photos")
class ClientPhotoEntity(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var photoUrl: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    var client: com.cezar.core.entities.client.ClientEntity? = null
)