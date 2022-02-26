# frozen_string_literal: true

module MatildaCore

  module Users

    # EditRecoverPasswordCodeEvent.
    class EditRecoverPasswordCodeEvent < MatildaCore::ApplicationEvent

      name_is :matilda_core_users_edit_recover_password_code

      payload_attributes_are :user_uuid, :recover_password_code, :log_who

      to_write_event do
        set_not_saved unless save_event && MatildaCore::User.find_by(
          uuid: payload[:user_uuid]
        )&.update(
          recover_password_code: payload[:recover_password_code],
          recover_password_code_time: Time.now
        )
      end

    end

  end

end
