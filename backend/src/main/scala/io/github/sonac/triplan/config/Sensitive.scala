package io.github.sonac.triplan.config

case class Sensitive(value: String) extends AnyVal {
  override def toString: String = "***"
}
