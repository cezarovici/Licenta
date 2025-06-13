package com.cezar.core.domain.model.locations

import jakarta.persistence.*

@Entity
@Table(name = "facilities")
open class Facility(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(nullable = false, unique = true)
    var name: String,

    @Column
    var iconUrl: String? = null
)