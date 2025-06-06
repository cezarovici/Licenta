package com.cezar.core.entity.reservations

import jakarta.persistence.*

@Entity
@Table(name = "reservation_details", schema = "core")
open class ReservationDetails(
    @Id
    var id: Long? = null,

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "reservation_id")
    var reservation: ReservationEntity? = null,

    @Column(name = "payment_transaction_id")
    var paymentTransactionId: String? = null,

    @Column(name = "invoice_url")
    var invoiceUrl: String? = null,

    @Lob
    var notes: String? = null
)