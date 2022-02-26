# frozen_string_literal: true

module MatildaCore

  module Memberships

    # EditPermissionsEvent.
    class EditPermissionsEvent < MatildaCore::ApplicationEvent

      name_is :matilda_core_memberships_edit_permissions

      payload_attributes_are :user_uuid, :group_uuid, :permissions, :log_who

      to_write_event do
        set_not_saved unless save_event && MatildaCore::Membership.find_by(
          user_uuid: payload[:user_uuid],
          group_uuid: payload[:group_uuid]
        )&.update(
          permissions: payload[:permissions]
        )
      end

    end

  end

end
