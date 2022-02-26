# frozen_string_literal: true

module MatildaCore

  module Users

    # EditPasswordEvent.
    class EditPasswordEvent < MatildaCore::ApplicationEvent

      name_is :matilda_core_users_edit_password

      payload_attributes_are :user_uuid, :password, :log_who

      to_write_event do
        set_not_saved unless save_event && MatildaCore::User.find_by(
          uuid: payload[:user_uuid]
        )&.update(
          password: payload[:password]
        )
      end

    end

  end

end
