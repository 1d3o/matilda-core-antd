# frozen_string_literal: true

require_relative '../../app/handlers/matilda_core/notifications_handler'
require_relative '../../app/events/matilda_core/users/invite_event'
require_relative '../../app/events/matilda_core/users/edit_recover_password_code_event'

# NotificationsHandler
MatildaCore::NotificationsHandler.listen(MatildaCore::Users::InviteEvent)
MatildaCore::NotificationsHandler.listen(MatildaCore::Users::EditRecoverPasswordCodeEvent)
