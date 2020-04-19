package io.github.sonac.triplan.email.sender

import io.github.sonac.triplan.email.EmailData
import io.github.sonac.triplan.test.BaseTest
import monix.execution.Scheduler.Implicits.global

class DummyEmailSenderTest extends BaseTest {
  it should "send scheduled email" in {
    DummyEmailSender(EmailData("test@sml.com", "subject", "content")).runSyncUnsafe()
    DummyEmailSender.findSentEmail("test@sml.com", "subject").isDefined shouldBe true
  }
}
