package com.cezar.core.domain.model.client

import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "client_details")
class ClientDetails(
    @Id
    var id: Long? = null,

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "client_id")
    var client: ClientEntity? = null,

    @Column(name="bio")
    var bio: String? = null,

    @Column(name = "date_of_birth")
    var dateOfBirth: LocalDate? = null,

    @Column
    var city: String? = null,

    @Column(name = "favorite_sports")
    var favoriteSports: String? = null,

    @Column
    var availability: String? = null,
)