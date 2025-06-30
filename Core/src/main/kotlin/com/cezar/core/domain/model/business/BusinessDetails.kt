package com.cezar.core.domain.model.business

import com.cezar.core.application.dto.business.BusinessDetailsDTO
import jakarta.persistence.*

@Entity
@Table(name = "business_details")
open class BusinessDetails(
    @Id
    var id: Long? = null,

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "business_id")
    var business: BusinessEntity? = null,

    @Column(nullable = true)
    var description: String? = null,

    @Column(nullable = true, name = "website_url")
    var websiteUrl: String? = null,

    @Column(nullable = true, name = "phone_number")
    var phoneNumber: String? = null,

    @Column(nullable = true, name = "email")
    var email: String? = null,
){
    fun toDTO() : BusinessDetailsDTO {
        return BusinessDetailsDTO(
            description = this.description,
            websiteUrl = this.websiteUrl,
            phoneNumber = this.phoneNumber,
            email = this.email,
        )
    }
}