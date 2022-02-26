# frozen_string_literal: true

require 'bcrypt'
require 'evnt'
require 'jwt'
require 'kaminari'

require 'matilda_core/config'
require 'matilda_core/engine'
require 'matilda_core/session'
require 'matilda_core/version'

# MatildaCore.
module MatildaCore

  class << self

    def config
      @config ||= Config.new
    end

    def configure
      yield config
    end

  end

end
