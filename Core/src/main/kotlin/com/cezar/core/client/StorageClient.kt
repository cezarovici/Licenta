package com.cezar.core.client

import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.multipart.MultipartFile

data class FileData(
    val url: String? = null
)

data class StorageResponse(
    val status: Int,
    val message: String,
    val data: FileData? = null
)

/**
 * Client Feign pentru a comunica cu microserviciul de stocare (storage-service-go).
 * Acesta este responsabil pentru operațiunile legate de fișiere, cum ar fi upload-ul.
 */
@FeignClient(
    name = "storage-service",
    url = "http://storage-service-go:3008"
)
interface StorageClient {


    /**
     * Încarcă un fișier și returnează un obiect ce conține URL-ul.
     */
    @PostMapping(
        value = ["/upload"],
        consumes = [MediaType.MULTIPART_FORM_DATA_VALUE]
    )
    fun uploadFile(@RequestPart("file") file: MultipartFile): StorageResponse

    /**
     * Șterge un fișier pe baza numelui său.
     */
    @DeleteMapping(value = ["/delete/{filename}"])
    fun deleteFile(@PathVariable("filename") filename: String): StorageResponse
}