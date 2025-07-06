
package com.cezar.core.domain.repository

import com.cezar.core.domain.model.locations.LocationPhotos
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository

interface LocationPhotosRepository : JpaRepository<LocationPhotos, Long>{
    fun findAllByLocation_Business_AccountId(businessAccountId: Long): List<LocationPhotos>
    fun findByIdAndLocation_Id(photoId: Long, locationId: Long): LocationPhotos?
}