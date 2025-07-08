package com.cezar.core.domain.repository

import com.cezar.core.domain.model.locations.LocationEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface LocationRepository : JpaRepository<LocationEntity, Long> {
    fun findAllByBusinessAccountId(businessAccountId: Long): List<LocationEntity>
    override fun findById(locationId: Long): Optional<LocationEntity>
}