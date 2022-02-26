# frozen_string_literal: true

module MatildaBoilerplate

  class ApplicationController < MatildaCore::ApplicationController

    before_action :session_present_check

    def index_view; end

  end

end
