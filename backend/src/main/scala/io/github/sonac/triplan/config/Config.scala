package io.github.sonac.triplan.config

import io.github.sonac.triplan.email.EmailConfig
import io.github.sonac.triplan.http.HttpConfig
import io.github.sonac.triplan.infrastructure.DBConfig
import io.github.sonac.triplan.passwordreset.PasswordResetConfig
import io.github.sonac.triplan.user.UserConfig

/**
  * Maps to the `application.conf` file. Configuration for all modules of the application.
  */
case class Config(db: DBConfig, api: HttpConfig, email: EmailConfig, passwordReset: PasswordResetConfig, user: UserConfig)
