# frozen_string_literal: true

module MatildaCore

  module Users

    # CreateEvent.
    class CreateEvent < MatildaCore::ApplicationEvent

      name_is :matilda_core_users_create

      payload_attributes_are :user_uuid, :username, :name, :surname, :password, :log_who

      to_write_event do
        set_not_saved unless save_event && MatildaCore::User.create(
          uuid: payload[:user_uuid],
          username: payload[:username],
          name: payload[:name],
          surname: payload[:surname],
          password: payload[:password]
        )
      end

    end

  end

end
