# frozen_string_literal: true

module MatildaCore

  # NotificationsHandler.
  class NotificationsHandler < MatildaCore::ApplicationHandler

    on :matilda_core_users_invite do
      to_manage_event do
        if event.extras[:with_notification_invite]
          MatildaCore::AuthenticationMailer.invite(event.payload[:user_uuid], event.payload[:email]).deliver_now unless Rails.env.test?
        end
      end
    end

    on :matilda_core_users_edit_recover_password_code do
      to_manage_event do
        MatildaCore::AuthenticationMailer.recover_password(event.payload[:user_uuid]).deliver_now unless Rails.env.test?
      end
    end

  end

end
