# frozen_string_literal: true

module MatildaCore

  # MembershipsController.
  class MembershipsController < MatildaCore::ApplicationController

    before_action do
      if session_present_check(:group_uuid)
        redirect_to matilda_core.root_path unless session_permission_present?(['matilda_core.memberships'])
      end

      packs_add('matilda_core')
    end

    def index_view; end

    def index_api
      users = @session.group.users.includes(:user_emails)

      users = sort_query(users, username: 'username SORT', name: 'name SORT', surname: 'surname SORT', email: 'matilda_core_user_emails.email SORT')
      users = paginate_query(users)

      render_json_success(
        users: users.map(&:as_json_with_email),
        params: params_for_query(users)
      )
    end

    def manage_api
      user = @session.group.users.find_by(uuid: params[:user_uuid])
      unless user
        json_errors(json_error(I18n.t('matilda.messages.user_not_valid'), code: :user_uuid))
        render_json_fail
        return
      end

      membership = MatildaCore::Membership.find_by(group_uuid: @session.group, user_uuid: user.uuid)
      unless membership
        json_errors(json_error(I18n.t('matilda.messages.user_not_valid'), code: :user_uuid))
        render_json_fail
        return
      end

      render_json_success(
        user: user.as_json,
        membership: membership.as_json,
        user_emails: user.user_emails
      )
    end

    def invitation_action
      command = command_manager(generate_invitation_command)
      return unless command

      render_json_success({})
    end

    def edit_permissions_action
      command = command_manager(generate_edit_permissions_command)
      return unless command

      session_update_group(@session.group_uuid) # aggiorno la sessione per aggiornare i permessi dell'utente
      render_json_success({})
    end

    def edit_permissions_role_action
      command = command_manager(generate_edit_permissions_role_command)
      return unless command

      session_update_group(@session.group_uuid) # aggiorno la sessione per aggiornare i permessi dell'utente
      render_json_success({})
    end

    # def remove_action
    #   command = command_manager(generate_remove_command)
    #   return unless command

    #   render_json_success({})
    # end

    private

    def generate_invitation_command
      command_params = params.permit(:name, :surname, :email)
      command_params[:group_uuid] = @session.group_uuid
      command_params[:log_who] = @session.user_uuid
      MatildaCore::Memberships::InviteMemberCommand.new(command_params)
    end

    def generate_edit_permissions_command
      command_params = params.permit(:user_uuid, permissions: [])
      command_params[:group_uuid] = @session.group_uuid
      command_params[:log_who] = @session.user_uuid
      command_params[:permissions] = command_params[:permissions] || []
      MatildaCore::Memberships::EditMemberPermissionsCommand.new(command_params)
    end

    def generate_edit_permissions_role_command
      command_params = params.permit(:user_uuid, :role)
      command_params[:group_uuid] = @session.group_uuid
      command_params[:log_who] = @session.user_uuid
      command_params[:permissions] = command_params[:permissions] || []
      MatildaCore::Memberships::EditMemberPermissionsRoleCommand.new(command_params)
    end

    def generate_remove_command
      command_params = params.permit(:user_uuid)
      command_params[:group_uuid] = @session.group_uuid
      command_params[:log_who] = @session.user_uuid
      MatildaCore::Memberships::RemoveMemberCommand.new(command_params)
    end

  end

end
