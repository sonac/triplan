package io.github.sonac.triplan.strava

import io.github.sonac.triplan.user._
import io.github.sonac.triplan.infrastructure.Doobie._
import io.github.sonac.triplan.util._
import com.softwaremill.tagging.@@

class StravaService(userModel: UserModel) {
  def updateStravaToken(userId: Id @@ User, token: String): ConnectionIO[Unit] = {
    userModel.updateToken(userId, token)
  }
}
