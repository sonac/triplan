package io.github.sonac.triplan.strava

import java.time.Instant

import cats.data.NonEmptyList
import doobie.util.transactor.Transactor
import monix.eval.Task
import sttp.model._
import sttp.tapir.server.ServerEndpoint

import io.github.sonac.triplan.http.{Error_OUT, Http}
import io.github.sonac.triplan.security.{ApiKey, Auth}
import io.github.sonac.triplan.infrastructure.Json._
import io.github.sonac.triplan.util.ServerEndpoints
import io.github.sonac.triplan.infrastructure.Doobie._
import sttp.model.StatusCode
import sttp.tapir.server.ServerEndpoint

class StravaApi(http: Http, auth: Auth[ApiKey], stravaService: StravaService, xa: Transactor[Task]) {
  import StravaApi._
  import http._

  private val StravaPath = "strava"

  val stravaOauthUrl =
    "http://www.strava.com/oauth/authorize?client_id=37166&response_type=code&approval_prompt=force&scope=read_all&redirect_uri=http://localhost:8080/api/v1/strava/exchange-token"

  private val oauthRedirect: ServerEndpoint[_, (StatusCode, Error_OUT), _, Nothing, Task] = secureEndpoint.get
    .in(StravaPath / "authorize")
    .out(
      header(
        HeaderNames.Location,
        stravaOauthUrl
      )
    )
    .out(statusCode(StatusCode.MovedPermanently))
    .serverLogic { _ => Task.now(println("Redirected to strava")).toOut }

  private val getUser: ServerEndpoint[_, (StatusCode, Error_OUT), Dummy_OUT, Nothing, Task] = secureEndpoint.get
    .in(StravaPath / "exchange-token")
    .in(query[String]("state"))
    .in(query[String]("code"))
    .in(query[String]("scope"))
    .out(jsonBody[Dummy_OUT])
    .serverLogic {
      case (authData, _, code, _) =>
        (for {
          userId <- auth(authData)
          _ <- stravaService.updateStravaToken(userId, code).transact(xa)
        } yield Dummy_OUT("asd")).toOut
    }

  val endpoints: ServerEndpoints =
    NonEmptyList
      .of(
        oauthRedirect,
        getUser
      )
      .map(_.tag("strava"))

}

object StravaApi {
  case class Dummy_OUT(id: String)
}
