# frozen_string_literal: true

require 'evnt'
require 'kaminari'

require 'matilda_boilerplate/config'
require 'matilda_boilerplate/engine'
require 'matilda_boilerplate/version'

# MatildaBoilerplate.
module MatildaBoilerplate

  class << self

    def config
      @config ||= Config.new
    end

    def configure
      yield config
    end

  end

end
