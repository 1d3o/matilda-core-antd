# frozen_string_literal: true

module MatildaCore

  module Users

    # CreateEmailEvent.
    class CreateEmailEvent < MatildaCore::ApplicationEvent

      name_is :matilda_core_users_create_email

      payload_attributes_are :user_uuid, :email, :primary, :log_who

      to_write_event do
        set_not_saved unless save_event && MatildaCore::UserEmail.create(
          email: payload[:email],
          user_uuid: payload[:user_uuid],
          primary: payload[:primary]
        )
      end

    end

  end

end
