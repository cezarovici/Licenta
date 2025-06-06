package com.cezar.core.entity.client

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
)