package io.github.sonac.triplan.user

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class UserRegisterValidatorSpec extends AnyFlatSpec with Matchers {
  "validate" should "accept valid data" in {
    val dataIsValid = UserRegisterValidator.validate("admin@triplan.com", "password")

    dataIsValid shouldBe Right(())
  }

  "validate" should "not accept missing email with spaces only" in {
    val dataIsValid = UserRegisterValidator.validate("   ", "password")

    dataIsValid.isLeft shouldBe true
  }

  "validate" should "not accept invalid email" in {
    val dataIsValid = UserRegisterValidator.validate("invalidEmail", "password")

    dataIsValid.isLeft shouldBe true
  }

  "validate" should "not accept password with empty spaces only" in {
    val dataIsValid = UserRegisterValidator.validate("admin@triplan.com", "    ")

    dataIsValid.isLeft shouldBe true
  }
}
