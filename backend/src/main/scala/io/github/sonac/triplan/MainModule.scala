package io.github.sonac.triplan

import java.time.Clock

import cats.data.NonEmptyList
import io.github.sonac.triplan.email.EmailModule
import io.github.sonac.triplan.http.{Http, HttpApi}
import io.github.sonac.triplan.infrastructure.InfrastructureModule
import io.github.sonac.triplan.metrics.MetricsModule
import io.github.sonac.triplan.passwordreset.PasswordResetModule
import io.github.sonac.triplan.security.SecurityModule
import io.github.sonac.triplan.strava.StravaModule
import io.github.sonac.triplan.user.UserModule
import io.github.sonac.triplan.util.{DefaultIdGenerator, IdGenerator, ServerEndpoints}
import monix.eval.Task

/**
  * Main application module. Depends on resources initialised in [[InitModule]].
  */
trait MainModule
    extends SecurityModule
    with EmailModule
    with UserModule
    with PasswordResetModule
    with MetricsModule
    with InfrastructureModule
    with StravaModule {

  override lazy val idGenerator: IdGenerator = DefaultIdGenerator
  override lazy val clock: Clock = Clock.systemUTC()

  lazy val http: Http = new Http()

  private lazy val endpoints: ServerEndpoints = userApi.endpoints concatNel passwordResetApi.endpoints concatNel stravaApi.endpoints
  private lazy val adminEndpoints: ServerEndpoints = NonEmptyList.of(metricsApi.metricsEndpoint, versionApi.versionEndpoint)

  lazy val httpApi: HttpApi = new HttpApi(http, endpoints, adminEndpoints, collectorRegistry, config.api)

  lazy val startBackgroundProcesses: Task[Unit] = emailService.startProcesses().void
}
