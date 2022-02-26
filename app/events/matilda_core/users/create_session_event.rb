# frozen_string_literal: true

module MatildaCore

  module Users

    # CreateSessionEvent.
    class CreateSessionEvent < MatildaCore::ApplicationEvent

      name_is :matilda_core_users_create_session

      payload_attributes_are :session_uuid, :user_uuid, :ip_address, :log_who

      to_write_event do
        set_not_saved unless save_event && MatildaCore::UserSession.create(
          uuid: payload[:session_uuid],
          user_uuid: payload[:user_uuid],
          ip_address: payload[:ip_address]
        )
      end

    end

  end

end
