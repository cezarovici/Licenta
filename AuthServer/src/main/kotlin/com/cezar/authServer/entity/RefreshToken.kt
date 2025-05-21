package com.cezar.authServer.entity

import jakarta.persistence.*
import java.time.Instant
import java.util.*


@Entity
@Table(name = "refresh_tokens")
class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private val id: UUID? = null

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private val user: UserEntity? = null

    @Column(nullable = false, unique = true)
    private val token: String? = null

    @Column(nullable = false)
    private val expiryDate: Instant? = null

    @Column(nullable = false)
    private val valid = true // getters & setters
}