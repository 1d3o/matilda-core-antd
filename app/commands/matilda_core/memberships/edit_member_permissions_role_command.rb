# frozen_string_literal: true

module MatildaCore

  module Memberships

    # EditMemberPermissionsRoleCommand.
    # Modifica i permessi dell'utente attraverso la selezione di un ruolo.
    class EditMemberPermissionsRoleCommand < MatildaCore::ApplicationCommand

      validates :group_uuid,
                presence: true, type: :string, blank: false,
                err: 'Gruppo non valido'

      validates :user_uuid,
                presence: true, type: :string, blank: false,
                err: 'Utente non valido'

      validates :role,
                presence: true, type: :string, blank: false,
                err: 'Ruolo non valido'

      to_validate_logic do
        user = MatildaCore::User.find_by(uuid: params[:user_uuid])
        group = MatildaCore::Group.find_by(uuid: params[:group_uuid])
        membership = MatildaCore::Membership.find_by(user_uuid: params[:user_uuid], group_uuid: params[:group_uuid])

        # verifico che l'utente esista e che faccia parte del gruppo
        unless user && membership
          err('Utente non valido', code: :user_uuid)
          break
        end

        # verifico che il gruppo esista
        unless group
          err('Gruppo non valido', code: :group_uuid)
          break
        end

        # verifico che il ruolo esista
        @role = MatildaCore.config.memberships_permissions_roles.select { |role| role[:name] == params[:role] }.first
        unless @role
          err('Ruolo non valido', code: :role)
          break
        end
      end

      to_initialize_events do
        event = MatildaCore::Memberships::EditPermissionsEvent.new(
          user_uuid: params[:user_uuid],
          group_uuid: params[:group_uuid],
          permissions: @role[:permissions],
          log_who: params[:log_who]
        )
        internal_error && break unless event.saved?
      end

    end

  end

end
