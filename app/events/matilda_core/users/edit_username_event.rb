# frozen_string_literal: true

module MatildaCore

  module Users

    # EditUsernameEvent.
    class EditUsernameEvent < MatildaCore::ApplicationEvent

      name_is :matilda_core_users_edit_username

      payload_attributes_are :user_uuid, :username, :log_who

      to_write_event do
        set_not_saved unless save_event && MatildaCore::User.find_by(
          uuid: payload[:user_uuid]
        )&.update(
          username: payload[:username]
        )
      end

    end

  end

end
