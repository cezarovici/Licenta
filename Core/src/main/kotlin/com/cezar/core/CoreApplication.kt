package com.cezar.core

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.openfeign.EnableFeignClients

@SpringBootApplication
@EnableFeignClients
class CoreApplication
fun main(args: Array<String>) {
	runApplication<CoreApplication>(*args)
}
