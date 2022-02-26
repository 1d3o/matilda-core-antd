# frozen_string_literal: true

module MatildaCore

  module Groups

    # CreateGroupCommand.
    # Permette di creare un nuovo gruppo.
    # Se viene creato da un utente specifico allora aggiunge l'utente al gruppo.
    class CreateGroupCommand < MatildaCore::ApplicationCommand

      attr_reader :group_uuid

      validates :name,
                presence: true, type: :string, blank: false,
                err: I18n.t('matilda.messages.name_not_valid')

      validates :log_who, type: :string

      to_validate_logic do
        if params[:log_who]
          unless MatildaCore.config.groups_permit_creation_to_users
            err(I18n.t('matilda.messages.groups_creation_unpermitted'), code: :log_who)
            break
          end

          if MatildaCore.config.groups_max_number_per_user && MatildaCore::Membership.where(user_uuid: params[:log_who]).length >= MatildaCore.config.groups_max_number_per_user
            err(I18n.t('matilda.messages.groups_max_number_per_user'), code: :log_who)
            break
          end
        end
      end

      to_initialize_events do
        @group_uuid = SecureRandom.uuid

        event_creation = MatildaCore::Groups::CreateEvent.new(
          group_uuid: @group_uuid,
          name: params[:name],
          log_who: params[:log_who]
        )
        internal_error && break unless event_creation.saved?

        if params[:log_who]
          # aggiungo l'utente al nuovo gruppo creato
          event_membership = MatildaCore::Memberships::CreateEvent.new(
            user_uuid: params[:log_who],
            group_uuid: @group_uuid,
            log_who: params[:log_who]
          )
          internal_error && break unless event_membership.saved?

          # assegno tutti i permessi al nuovo utente creato
          event_permissions = MatildaCore::Memberships::EditPermissionsEvent.new(
            user_uuid: params[:log_who],
            group_uuid: @group_uuid,
            permissions: MatildaCore.config.memberships_permissions.map { |p| p[:name] },
            log_who: params[:log_who]
          )
          internal_error && break unless event_permissions.saved?
        end
      end

    end

  end

end
