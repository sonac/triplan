package io.github.sonac.triplan.strava

import java.time.Clock

import io.github.sonac.triplan.test.{BaseTest, TestConfig, Requests, TestEmbeddedPostgres}
import io.github.sonac.triplan.MainModule
import io.github.sonac.triplan.config.Config
import doobie.util.transactor
import org.http4s.{Status, Header}
import monix.eval.Task
import org.scalatest.concurrent.Eventually
import sttp.client.SttpBackend
import sttp.client.testing.SttpBackendStub
import sttp.client.impl.monix.TaskMonadAsyncError
import sttp.model.HeaderNames
import org.http4s.Headers

class StravaApiTest extends BaseTest with TestEmbeddedPostgres with Eventually {

  lazy val modules: MainModule = new MainModule {
    override def xa: transactor.Transactor[Task] = currentDb.xa
    override def baseSttpBackend: SttpBackend[Task, Nothing, sttp.client.NothingT] = SttpBackendStub(TaskMonadAsyncError)
    override def config: Config = TestConfig
    override lazy val clock: Clock = testClock
  }

  val requests = new Requests(modules)
  import requests._

  "/strava/authorize" should "redirect" in {
    val response1 = stravaAuth()

    response1.status shouldBe Status.MovedPermanently
    response1.headers shouldBe Headers.of(
      Header(
        HeaderNames.Location,
        "http://www.strava.com/oauth/authorize?client_id=37166&response_type=code&approval_prompt=force&scope=read_all&redirect_uri=http://localhost:8080/api/v1/strava/exchange-token"
      )
    )
  }
}
