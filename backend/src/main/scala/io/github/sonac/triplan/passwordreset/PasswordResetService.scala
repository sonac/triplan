package io.github.sonac.triplan.passwordreset

import java.time.Clock
import java.time.temporal.ChronoUnit

import cats.implicits._
import io.github.sonac.triplan._
import io.github.sonac.triplan.email.{EmailData, EmailScheduler, EmailSubjectContent, EmailTemplates}
import io.github.sonac.triplan.infrastructure.Doobie._
import io.github.sonac.triplan.security.Auth
import io.github.sonac.triplan.user.{User, UserModel}
import io.github.sonac.triplan.util._
import com.typesafe.scalalogging.StrictLogging
import monix.eval.Task

class PasswordResetService(
    userModel: UserModel,
    passwordResetCodeModel: PasswordResetCodeModel,
    emailScheduler: EmailScheduler,
    emailTemplates: EmailTemplates,
    auth: Auth[PasswordResetCode],
    idGenerator: IdGenerator,
    config: PasswordResetConfig,
    clock: Clock,
    xa: Transactor[Task]
) extends StrictLogging {

  def forgotPassword(email: String): ConnectionIO[Unit] = {
    println(email)
    userModel.findByEmail(email.lowerCased).flatMap {
      case None => Fail.NotFound("user").raiseError[ConnectionIO, Unit]
      case Some(user) =>
        createCode(user).flatMap(sendCode(user, _))
    }
  }

  private def createCode(user: User): ConnectionIO[PasswordResetCode] = {
    logger.debug(s"Creating password reset code for user: ${user.id}")
    val validUntil = clock.instant().plus(config.codeValid.toMinutes, ChronoUnit.MINUTES)
    val code = PasswordResetCode(idGenerator.nextId[PasswordResetCode](), user.id, validUntil)
    passwordResetCodeModel.insert(code).map(_ => code)
  }

  private def sendCode(user: User, code: PasswordResetCode): ConnectionIO[Unit] = {
    logger.debug(s"Scheduling e-mail with reset code for user: ${user.id}")
    emailScheduler(EmailData(user.emailLowerCased, prepareResetEmail(user, code)))
  }

  private def prepareResetEmail(user: User, code: PasswordResetCode): EmailSubjectContent = {
    val resetLink = String.format(config.resetLinkPattern, code.id)
    emailTemplates.passwordReset(user.emailLowerCased, resetLink)
  }

  def resetPassword(code: String, newPassword: String): Task[Unit] = {
    for {
      userId <- auth(code.asInstanceOf[Id])
      _ = logger.debug(s"Resetting password for user: $userId")
      _ <- userModel.updatePassword(userId, User.hashPassword(newPassword)).transact(xa)
    } yield ()
  }
}
