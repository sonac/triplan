package io.github.sonac.triplan.test

import io.github.sonac.triplan.MainModule
import io.github.sonac.triplan.infrastructure.Json._
import io.github.sonac.triplan.user.UserApi._
import monix.eval.Task
import org.http4s._
import org.http4s.syntax.all._

import scala.util.Random

class Requests(val modules: MainModule) extends HttpTestSupport {

  case class RegisteredUser(email: String, password: String, apiKey: String)

  private val random = new Random()

  def randomEmailPassword(): (String, String) =
    (s"user${random.nextInt(9000)}@triplan.com", random.nextString(12))

  def registerUser(email: String, password: String): Response[Task] = {
    val request = Request[Task](method = POST, uri = uri"/user/register")
      .withEntity(Register_IN(email, password))

    modules.httpApi.mainRoutes(request).unwrap
  }

  def newRegisteredUsed(): RegisteredUser = {
    val (email, password) = randomEmailPassword()
    val apiKey = registerUser(email, password).shouldDeserializeTo[Register_OUT].apiKey
    RegisteredUser(email, password, apiKey)
  }

  def loginUser(email: String, password: String, apiKeyValidHours: Option[Int] = None): Response[Task] = {
    val request = Request[Task](method = POST, uri = uri"/user/login")
      .withEntity(Login_IN(email, password, apiKeyValidHours))

    modules.httpApi.mainRoutes(request).unwrap
  }

  def getUser(apiKey: String): Response[Task] = {
    val request = Request[Task](method = GET, uri = uri"/user")
    modules.httpApi.mainRoutes(authorizedRequest(apiKey, request)).unwrap
  }

  def changePassword(apiKey: String, password: String, newPassword: String): Response[Task] = {
    val request = Request[Task](method = POST, uri = uri"/user/changepassword")
      .withEntity(ChangePassword_IN(password, newPassword))

    modules.httpApi.mainRoutes(authorizedRequest(apiKey, request)).unwrap
  }

  def updateUser(apiKey: String, email: String): Response[Task] = {
    val request = Request[Task](method = POST, uri = uri"/user")
      .withEntity(UpdateUser_IN(email))

    modules.httpApi.mainRoutes(authorizedRequest(apiKey, request)).unwrap
  }

  def stravaAuth(): Response[Task] = {
    val request = Request[Task](method = GET, uri = uri"/strava/authorize")

    modules.httpApi.mainRoutes(request).unwrap
  }

  def stravaExchangeToken(): Response[Task] = {
    val request = Request[Task](method = GET, uri = uri"/strava/exchange-token")

    modules.httpApi.mainRoutes(request).unwrap
  }

}
