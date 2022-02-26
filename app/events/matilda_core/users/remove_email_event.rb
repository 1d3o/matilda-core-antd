# frozen_string_literal: true

module MatildaCore

  module Users

    # RemoveEmailEvent.
    class RemoveEmailEvent < MatildaCore::ApplicationEvent

      name_is :matilda_core_users_remove_email

      payload_attributes_are :user_uuid, :email, :log_who

      to_write_event do
        set_not_saved unless save_event && MatildaCore::UserEmail.find_by(
          email: payload[:email],
          user_uuid: payload[:user_uuid]
        )&.destroy
      end

    end

  end

end
