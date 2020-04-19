package io.github.sonac.triplan.security

import java.time.{Clock, Instant}
import java.time.temporal.ChronoUnit

import io.github.sonac.triplan.user.User
import com.softwaremill.tagging.@@
import io.github.sonac.triplan.infrastructure.Doobie._
import io.github.sonac.triplan.util.{Id, IdGenerator}
import com.typesafe.scalalogging.StrictLogging

import scala.concurrent.duration.Duration

class ApiKeyService(apiKeyModel: ApiKeyModel, idGenerator: IdGenerator, clock: Clock) extends StrictLogging {

  def create(userId: Id @@ User, valid: Duration): ConnectionIO[ApiKey] = {
    val now = clock.instant()
    val validUntil = now.plus(valid.toMinutes, ChronoUnit.MINUTES)
    val apiKey = ApiKey(idGenerator.nextId[ApiKey](), userId, now, validUntil)

    logger.debug(s"Creating a new api key for user $userId, valid until: $validUntil")
    apiKeyModel.insert(apiKey).map(_ => apiKey)
  }
}

case class ApiKey(id: Id @@ ApiKey, userId: Id @@ User, createdOn: Instant, validUntil: Instant)
