package com.cezar.core.domain.model.client


import jakarta.persistence.*

@Entity
@Table(name = "clients",  schema = "core")
class ClientEntity(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(unique = true, nullable = false)
    var email: String,

    @Column(nullable = false)
    var profilePhotoUrl: String,

    @Column(nullable = false)
    var firstName: String,

    @Column(nullable = false)
    var lastName: String,

    @OneToMany(mappedBy = "creator", cascade = [CascadeType.ALL], orphanRemoval = true)
    var createdEvents: MutableSet<com.cezar.core.domain.model.event.EventEntity> = mutableSetOf(),

    @OneToMany(mappedBy = "client")
    var participations: MutableSet<com.cezar.core.domain.model.event.EventParticipation> = mutableSetOf(),

    @OneToMany(mappedBy = "client", cascade = [CascadeType.ALL], orphanRemoval = true)
    var photos: MutableSet<com.cezar.core.domain.model.client.ClientPhotoEntity> = mutableSetOf(),
)