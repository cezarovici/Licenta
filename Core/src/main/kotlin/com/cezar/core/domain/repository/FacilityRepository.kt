package com.cezar.core.domain.repository

import com.cezar.core.domain.model.locations.Facility
import com.cezar.core.domain.model.locations.LocationEntity
import org.springframework.data.jpa.repository.JpaRepository

interface FacilityRepository : JpaRepository<Facility, Long>{
    fun findAllByLocationId(locationId: Long): MutableList<Facility>
    fun deleteAllByLocation(location: LocationEntity)
}