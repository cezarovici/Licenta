package com.cezar.core.domain.model.reservations

enum class ReservationStatus {
    PENDING_CONFIRMATION,

    CONFIRMED_UNPAID,

    CONFIRMED_PAID,

    COMPLETED,

    CANCELLED
}


enum class PaymentMethod {
    CASH,
    CARD_ONLINE,
    PLATFORM_CREDIT
}