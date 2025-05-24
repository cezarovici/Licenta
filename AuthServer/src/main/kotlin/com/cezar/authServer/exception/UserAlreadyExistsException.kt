
package com.cezar.authServer.exception

class UserAlreadyExistsException(username: String) : RuntimeException("User with username $username already exists")
