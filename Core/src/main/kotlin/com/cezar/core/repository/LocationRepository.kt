package com.cezar.core.repository

import com.cezar.core.domain.model.locations.LocationEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface LocationRepository : JpaRepository<LocationEntity, Long> {
    // Poți adăuga metode custom dacă ai nevoie, ex:
    fun findAllByBusinessAccountId(businessAccountId: Long): List<LocationEntity>
    fun findByIdAndBusinessAccountId(locationId: Long, businessAccountId: Long): LocationEntity?
}