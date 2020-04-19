package io.github.sonac.triplan.util

import java.time.Clock

import io.github.sonac.triplan.config.Config

trait BaseModule {
  def idGenerator: IdGenerator
  def clock: Clock
  def config: Config
}
