package com.cezar.core.config

import kotlin.annotation.AnnotationRetention.RUNTIME
import kotlin.annotation.AnnotationTarget.CLASS
import kotlin.annotation.AnnotationTarget.FUNCTION

/**
 * Anotare care marchează un endpoint sau un întreg controller ca necesitând
 * verificarea că user-ul autentificat este proprietarul resursei de business.
 *
 * Se așteaptă ca request-ul să conțină un @PathVariable("businessAccountId")
 * și un @RequestHeader("X-User-Id").
 */
@Target(CLASS, FUNCTION) // Poate fi aplicată pe clase sau funcții
@Retention(RUNTIME)
annotation class AuthorizeBusinessOwner

@Target(AnnotationTarget.VALUE_PARAMETER)
@Retention(AnnotationRetention.RUNTIME)
annotation class CurrentBusinessId