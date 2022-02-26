# frozen_string_literal: true

module MatildaCore

  module Users

    # EditEmailPrimaryEvent.
    class EditEmailPrimaryEvent < MatildaCore::ApplicationEvent

      name_is :matilda_core_users_edit_email_primary

      payload_attributes_are :user_uuid, :email, :primary, :log_who

      to_write_event do
        set_not_saved unless save_event && MatildaCore::UserEmail.find_by(
          email: payload[:email],
          user_uuid: payload[:user_uuid]
        )&.update(
          primary: payload[:primary]
        )
      end

    end

  end

end
