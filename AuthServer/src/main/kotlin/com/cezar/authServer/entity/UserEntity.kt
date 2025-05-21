package com.cezar.authServer.entity

import com.cezar.authServer.dto.UserDTO
import jakarta.persistence.*
import lombok.*
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.util.*

@Entity
@AllArgsConstructor
data class UserEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private val id: Long = 0,

    @Column(nullable = false, unique = true)
    private val email: String,

    @Column(nullable = false, unique = true)
    private val username: String,

    @Column(nullable = false)
    private val password: String,

    private val isEnabled: Boolean = true,
    private val isCredentialsNonExpired: Boolean = true,
    private val isAccountNonExpired: Boolean = true,
    private val isAccountNonLocked: Boolean = true,

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "user_roles",
        joinColumns = [JoinColumn(name = "user_id")]
    )
    private val authorities: Set<GrantedAuthority>,

    @Temporal(TemporalType.TIMESTAMP)
    private val createdAt: Date = Date(),

    @Temporal(TemporalType.TIMESTAMP)
    private val updatedAt: Date = Date()
) : UserDetails {
    override fun getAuthorities(): Set<GrantedAuthority> = authorities
    override fun getPassword(): String = password
    override fun getUsername(): String = username
    override fun isAccountNonExpired(): Boolean = isAccountNonExpired
    override fun isAccountNonLocked(): Boolean = isAccountNonLocked
    override fun isCredentialsNonExpired(): Boolean = isCredentialsNonExpired
    override fun isEnabled(): Boolean = isEnabled

    fun getId(): Long = id

    fun toDTO(): UserDTO {
        return UserDTO(
            id = this.id,
            username = this.username,
            email = this.email,
            role = this.authorities.joinToString(", ") { it.authority }, // Transformăm autoritățile într-un string
            createdAt = this.createdAt,  // Adăugăm data creării
            updatedAt = this.updatedAt,  // Adăugăm data actualizării
            isEnabled = this.isEnabled,  // Adăugăm starea contului
            authorities = this.authorities.map { it.authority }.toSet()  // Mapăm autoritățile la un set de stringuri
        )
    }
}

