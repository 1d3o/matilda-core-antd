# frozen_string_literal: true

module MatildaCore

  # ApplicationEvent.
  class ApplicationEvent < Evnt::Event

    default_options silent: false

    protected

    # TODO: Implementare log degli eventi su un doc a parte.
    def save_event
      true
    end

  end

end
