# frozen_string_literal: true

module MatildaCore

  module Groups

    # CreateEvent.
    class CreateEvent < MatildaCore::ApplicationEvent

      name_is :matilda_core_groups_create

      payload_attributes_are :group_uuid, :name, :log_who

      to_write_event do
        set_not_saved unless save_event && MatildaCore::Group.create(
          uuid: payload[:group_uuid],
          name: payload[:name]
        )
      end

    end

  end

end
