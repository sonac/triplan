package io.github.sonac.triplan.test

import io.github.sonac.triplan.infrastructure.CorrelationId
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

trait BaseTest extends AnyFlatSpec with Matchers {
  CorrelationId.init()
  val testClock = new TestClock()
}
