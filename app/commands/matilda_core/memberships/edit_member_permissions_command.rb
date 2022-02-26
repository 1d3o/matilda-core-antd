# frozen_string_literal: true

module MatildaCore

  module Memberships

    # EditMemberPermissionsCommand.
    # Modifica i permessi dell'utente.
    class EditMemberPermissionsCommand < MatildaCore::ApplicationCommand

      validates :group_uuid,
                presence: true, type: :string, blank: false,
                err: 'Gruppo non valido'

      validates :user_uuid,
                presence: true, type: :string, blank: false,
                err: 'Utente non valido'

      validates :permissions,
                presence: true, type: :array, blank: false,
                err: 'Permessi non validi'

      to_normalize_params do
        params[:permissions] ||= []
      end

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
      end

      to_initialize_events do
        event = MatildaCore::Memberships::EditPermissionsEvent.new(
          user_uuid: params[:user_uuid],
          group_uuid: params[:group_uuid],
          permissions: params[:permissions],
          log_who: params[:log_who]
        )
        internal_error && break unless event.saved?
      end

    end

  end

end
