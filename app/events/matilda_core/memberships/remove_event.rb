# frozen_string_literal: true

module MatildaCore

  module Memberships

    # RemoveEvent.
    class RemoveEvent < MatildaCore::ApplicationEvent

      name_is :matilda_core_memberships_remove

      payload_attributes_are :user_uuid, :group_uuid, :log_who

      to_write_event do
        set_not_saved unless save_event && MatildaCore::Membership.where(
          user_uuid: payload[:user_uuid],
          group_uuid: payload[:group_uuid]
        ).destroy_all
      end

    end

  end

end
