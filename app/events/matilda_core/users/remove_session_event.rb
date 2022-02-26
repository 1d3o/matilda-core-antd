# frozen_string_literal: true

module MatildaCore

  module Users

    # RemoveSessionEvent.
    class RemoveSessionEvent < MatildaCore::ApplicationEvent

      name_is :matilda_core_users_remove_session

      payload_attributes_are :session_uuid, :log_who

      to_write_event do
        set_not_saved unless save_event && MatildaCore::UserSession.find_by(
          uuid: payload[:session_uuid]
        )&.update(
          closed_at: Time.now
        )
      end

    end

  end

end
