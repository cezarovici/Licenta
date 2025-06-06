package com.cezar.core.entity.reservations

import com.cezar.core.entity.event.EventEntity
import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "reservations", schema = "core")
open class ReservationEntity(
    @Id
    var id: Long? = null,

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "event_id")
    var event: EventEntity? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var status: ReservationStatus = ReservationStatus.PENDING_CONFIRMATION,

    @Column(name = "total_cost", nullable = false)
    var totalCost: BigDecimal = BigDecimal.ZERO,

    @Column(name = "amount_paid")
    var amountPaid: BigDecimal = BigDecimal.ZERO,

    @Column(name = "platform_fee")
    var platformFee: BigDecimal = BigDecimal.ZERO,

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    var paymentMethod: PaymentMethod? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @OneToOne(mappedBy = "reservation", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var details: ReservationDetails? = null

) {
    fun addDetails(details: ReservationDetails) {
        this.details = details
        details.reservation = this
    }
}