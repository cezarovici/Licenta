package com.cezar.core.entities.locations

import jakarta.persistence.*

@Entity
@Table(name = "facilities", schema = "core")
open class Facility(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, unique = true)
    var name: String,

    @Column
    var iconUrl: String? = null
)