package com.cezar.authServer.repository

import com.cezar.authServer.entity.UserEntity
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface UserInfoRepository : CrudRepository<UserEntity,Long>
{
    fun findByUsername(username: String): UserEntity?
    fun findByEmail(email: String): UserEntity?
}