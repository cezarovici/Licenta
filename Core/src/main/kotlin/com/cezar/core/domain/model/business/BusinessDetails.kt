package com.cezar.core.entities.business

import jakarta.persistence.*

@Entity
@Table(name = "business_details", schema = "core")
open class BusinessDetails(
    @Id
    var id: Long? = null,

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "business_id")
    var business: com.cezar.core.entities.business.BusinessEntity? = null,

    @Lob
    @Column(nullable = true)
    var description: String? = null,

    @Column(nullable = true, name = "website_url")
    var websiteUrl: String? = null,

    @Column(nullable = true, name = "phone_number")
    var phoneNumber: String? = null,

    @Column(nullable = true, name = "email")
    var email: String? = null
)