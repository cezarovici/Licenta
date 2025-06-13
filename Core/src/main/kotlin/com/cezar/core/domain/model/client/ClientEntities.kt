package com.cezar.core.domain.model.client


import jakarta.persistence.*

@Entity
@Table(name = "clients")
class ClientEntity(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false, name = "account_id")
    val accountId: Long,

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

    @OneToOne(mappedBy = "client", cascade = [CascadeType.ALL], fetch = FetchType.EAGER, optional = false)
    var details: ClientDetails? = null,
)
{
    fun addDetails(details: ClientDetails) {
        this.details = details
        details.client = this
    }

}