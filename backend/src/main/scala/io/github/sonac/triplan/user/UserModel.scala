package io.github.sonac.triplan.user

import java.time.Instant

import cats.implicits._
import io.github.sonac.triplan.infrastructure.Doobie._
import io.github.sonac.triplan.util.{Id, LowerCased}
import com.softwaremill.tagging.@@
import tsec.common.VerificationStatus
import tsec.passwordhashers.PasswordHash
import tsec.passwordhashers.jca.SCrypt

class UserModel {

  def insert(user: User): ConnectionIO[Unit] = {
    sql"""INSERT INTO users (id, email_lowercase, password, created_on)
         |VALUES (${user.id}, ${user.emailLowerCased}, ${user.passwordHash}, ${user.createdOn})""".stripMargin.update.run.void
  }

  def findById(id: Id @@ User): ConnectionIO[Option[User]] = {
    findBy(fr"id = $id")
  }

  def findByEmail(email: String @@ LowerCased): ConnectionIO[Option[User]] = {
    findBy(fr"email_lowercase = $email")
  }

  private def findBy(by: Fragment): ConnectionIO[Option[User]] = {
    (sql"SELECT id, email_lowercase, password, created_on FROM users WHERE " ++ by)
      .query[User]
      .option
  }

  def updatePassword(userId: Id @@ User, newPassword: PasswordHash[SCrypt]): ConnectionIO[Unit] =
    sql"""UPDATE users SET password = $newPassword WHERE id = $userId""".stripMargin.update.run.void

  def updateEmail(userId: Id @@ User, newEmail: String @@ LowerCased): ConnectionIO[Unit] =
    sql"""UPDATE users SET email_lowercase = $newEmail WHERE id = $userId""".stripMargin.update.run.void
}

case class User(
    id: Id @@ User,
    emailLowerCased: String @@ LowerCased,
    passwordHash: PasswordHash[SCrypt],
    createdOn: Instant
) {

  def verifyPassword(password: String): VerificationStatus = SCrypt.checkpw[cats.Id](password, passwordHash)
}

object User {
  def hashPassword(password: String): PasswordHash[SCrypt] = SCrypt.hashpw[cats.Id](password)
}
