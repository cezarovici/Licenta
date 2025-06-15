package com.cezar.authServer.controller

import com.cezar.authServer.dto.AuthUserResponseDTO
import com.cezar.authServer.dto.LoginUserDto
import com.cezar.authServer.dto.RegisterUserDto
import com.cezar.authServer.entity.UserEntity
import com.cezar.authServer.service.AuthService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.slf4j.LoggerFactory // <-- NOU: Importă LoggerFactory
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/idm/auth")
class AuthController {
    @Autowired
    private lateinit var authUserService: AuthService

    private val logger = LoggerFactory.getLogger(AuthController::class.java) // <-- NOU: Inițializează logger-ul

    @GetMapping("/welcome")
    private fun welcome(): String {
        return "Welcome"
    }

    @PostMapping("/login")
    fun login(@RequestBody userInfo: LoginUserDto): ResponseEntity<*> {
        val token = authUserService.signin(userInfo)
        return ResponseEntity.ok(token)
    }

    @PostMapping("/signup")
    fun register(@RequestBody registerUserDto: RegisterUserDto): ResponseEntity<AuthUserResponseDTO> {
        val registeredUser: UserEntity = authUserService.signup(registerUserDto)

        val responseDto = AuthUserResponseDTO(
            id = registeredUser.getId(),
            email = registeredUser.getEmail(),
            username = registeredUser.username
        )

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto)
    }

    /**
     * Endpoint intern pentru ștergerea unui utilizator pe baza ID-ului său.
     * Această rută ar trebui protejată la nivel de API Gateway/firewall
     * pentru a fi accesibilă doar de la servicii de încredere (e.g., Core Service).
     *
     * @param userId ID-ul utilizatorului de șters.
     * @return ResponseEntity cu HttpStatus.NO_CONTENT dacă ștergerea a avut succes,
     * sau HttpStatus.NOT_FOUND dacă utilizatorul nu a fost găsit.
     */
    @DeleteMapping("/user/{userId}") // <-- NOU: Endpoint specific pentru ștergere internă
    fun deleteUser(@PathVariable userId: Long): ResponseEntity<Void> {
        logger.info("Received request to delete user with ID: $userId")
        try {
            authUserService.deleteUserById(userId)
            logger.info("Successfully deleted user with ID: $userId")
            return ResponseEntity.noContent().build() // 204 No Content
        } catch (e: ResponseStatusException) {
            logger.error("Failed to delete user with ID $userId: ${e.reason}", e)
            // Propagă eroarea de la service (ex: NOT_FOUND)
            throw e
        } catch (e: Exception) {
            logger.error("An unexpected error occurred while deleting user with ID $userId", e)
            throw ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete user due to an unexpected error.", e)
        }
    }
}