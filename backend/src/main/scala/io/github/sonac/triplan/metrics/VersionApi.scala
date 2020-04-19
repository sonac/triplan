package io.github.sonac.triplan.metrics

import io.github.sonac.triplan.http.{Error_OUT, Http}
import io.github.sonac.triplan.infrastructure.Json._
import io.github.sonac.triplan.version.BuildInfo
import monix.eval.Task
import sttp.model.StatusCode
import sttp.tapir.server.ServerEndpoint

/**
  * Defines an endpoint which exposes the current application version information.
  */
class VersionApi(http: Http) {
  import VersionApi._
  import http._

  val versionEndpoint: ServerEndpoint[Unit, (StatusCode, Error_OUT), Version_OUT, Nothing, Task] = baseEndpoint.get
    .in("version")
    .out(jsonBody[Version_OUT])
    .serverLogic { _ =>
      Task.now(Version_OUT(BuildInfo.builtAtString, BuildInfo.lastCommitHash)).toOut
    }
}

object VersionApi {
  case class Version_OUT(buildDate: String, buildSha: String)
}
