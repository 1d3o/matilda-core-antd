# frozen_string_literal: true

module MatildaCore

  module Memberships

    # CreateEvent.
    class CreateEvent < MatildaCore::ApplicationEvent

      name_is :matilda_core_memberships_create

      payload_attributes_are :user_uuid, :group_uuid, :log_who

      to_write_event do
        set_not_saved unless save_event && MatildaCore::Membership.create(
          user_uuid: payload[:user_uuid],
          group_uuid: payload[:group_uuid]
        )
      end

    end

  end

end
