package io.github.sonac.triplan.email.sender

import io.github.sonac.triplan.email.EmailData
import monix.eval.Task

trait EmailSender {
  def apply(email: EmailData): Task[Unit]
}
