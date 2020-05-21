package io.github.sonac.triplan.user

import java.time.Clock

import cats.implicits._
import io.github.sonac.triplan._
import io.github.sonac.triplan.email.{EmailData, EmailScheduler, EmailTemplates}
import io.github.sonac.triplan.security.{ApiKey, ApiKeyService}
import com.softwaremill.tagging.@@
import com.typesafe.scalalogging.StrictLogging
import tsec.common.Verified
import io.github.sonac.triplan.infrastructure.Doobie._
import io.github.sonac.triplan.util._

import scala.concurrent.duration.Duration

class UserService(
    userModel: UserModel,
    emailScheduler: EmailScheduler,
    emailTemplates: EmailTemplates,
    apiKeyService: ApiKeyService,
    idGenerator: IdGenerator,
    clock: Clock,
    config: UserConfig
) extends StrictLogging {

  private val EmailAlreadyUsed = "E-mail already in use!"

  def registerNewUser(email: String, password: String): ConnectionIO[ApiKey] = {
    def failIfDefined(op: ConnectionIO[Option[User]], msg: String): ConnectionIO[Unit] = {
      op.flatMap {
        case None    => ().pure[ConnectionIO]
        case Some(_) => Fail.IncorrectInput(msg).raiseError[ConnectionIO, Unit]
      }
    }

    def checkUserDoesNotExist(): ConnectionIO[Unit] = {
      failIfDefined(userModel.findByEmail(email.lowerCased), EmailAlreadyUsed)
    }

    def doRegister(): ConnectionIO[ApiKey] = {
      val user = User(idGenerator.nextId[User](), email.lowerCased, User.hashPassword(password), clock.instant(), false, None)
      val confirmationEmail = emailTemplates.registrationConfirmation(email)

      logger.debug(s"Registering new user: ${user.emailLowerCased}, with id: ${user.id}")

      for {
        _ <- userModel.insert(user)
        _ <- emailScheduler(EmailData(email, confirmationEmail))
        apiKey <- apiKeyService.create(user.id, config.defaultApiKeyValid)
      } yield apiKey
    }

    for {
      _ <- UserRegisterValidator
        .validate(email, password)
        .fold(msg => Fail.IncorrectInput(msg).raiseError[ConnectionIO, Unit], _ => ().pure[ConnectionIO])
      _ <- checkUserDoesNotExist()
      apiKey <- doRegister()
    } yield apiKey
  }

  def findById(id: Id @@ User): ConnectionIO[User] = userOrNotFound(userModel.findById(id))

  def login(email: String, password: String, apiKeyValid: Option[Duration]): ConnectionIO[ApiKey] =
    for {
      user <- userOrNotFound(userModel.findByEmail(email.lowerCased))
      _ <- verifyPassword(user, password)
      apiKey <- apiKeyService.create(user.id, apiKeyValid.getOrElse(config.defaultApiKeyValid))
    } yield apiKey

  def changeUser(userId: Id @@ User, newEmail: String): ConnectionIO[Unit] = {

    def changeEmail(newEmail: String): ConnectionIO[Unit] = {
      val newEmailLowerCased = newEmail.lowerCased
      userModel.findByEmail(newEmailLowerCased).flatMap {
        case Some(user) if user.id != userId                          => Fail.IncorrectInput(EmailAlreadyUsed).raiseError[ConnectionIO, Unit]
        case Some(user) if user.emailLowerCased == newEmailLowerCased => ().pure[ConnectionIO]
        case _ =>
          logger.debug(s"Changing email for user: $userId, to: $newEmail")
          userModel.updateEmail(userId, newEmailLowerCased)
      }
    }

    changeEmail(newEmail)
  }

  def changePassword(userId: Id @@ User, currentPassword: String, newPassword: String): ConnectionIO[Unit] =
    for {
      user <- userOrNotFound(userModel.findById(userId))
      _ <- verifyPassword(user, currentPassword)
      _ = logger.debug(s"Changing password for user: $userId")
      _ <- userModel.updatePassword(userId, User.hashPassword(newPassword))
    } yield ()

  private def userOrNotFound(op: ConnectionIO[Option[User]]): ConnectionIO[User] = {
    op.flatMap {
      case Some(user) => user.pure[ConnectionIO]
      case None       => Fail.NotFound("user").raiseError[ConnectionIO, User]
    }
  }

  private def verifyPassword(user: User, password: String): ConnectionIO[Unit] = {
    if (user.verifyPassword(password) == Verified) {
      ().pure[ConnectionIO]
    } else {
      Fail.Unauthorized.raiseError[ConnectionIO, Unit]
    }
  }
}

object UserRegisterValidator {
  private val ValidationOk = Right(())
  val MinLoginLength = 3

  def validate(email: String, password: String): Either[String, Unit] =
    for {
      _ <- validEmail(email.trim)
      _ <- validPassword(password.trim)
    } yield ()

  private val emailRegex =
    """^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$""".r

  private def validEmail(email: String) =
    if (emailRegex.findFirstMatchIn(email).isDefined) ValidationOk else Left("Invalid e-mail!")

  private def validPassword(password: String) =
    if (password.nonEmpty) ValidationOk else Left("Password cannot be empty!")
}
