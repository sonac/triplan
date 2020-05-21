package io.github.sonac.triplan.strava

import io.github.sonac.triplan.http.Http
import io.github.sonac.triplan.security.{ApiKey, ApiKeyService, Auth}
import io.github.sonac.triplan.user.UserModel
import doobie.util.transactor.Transactor
import monix.eval.Task

trait StravaModule {
  lazy val stravaApi = new StravaApi(http, apiKeyAuth, stravaService, xa)
  lazy val stravaService = new StravaService(userModel)

  def http: Http
  def apiKeyAuth: Auth[ApiKey]
  def apiKeyService: ApiKeyService
  def xa: Transactor[Task]
  def userModel: UserModel
}
