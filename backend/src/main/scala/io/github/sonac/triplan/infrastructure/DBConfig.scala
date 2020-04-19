package io.github.sonac.triplan.infrastructure

import io.github.sonac.triplan.config.Sensitive

case class DBConfig(username: String, password: Sensitive, url: String, migrateOnStart: Boolean, driver: String, connectThreadPoolSize: Int)
