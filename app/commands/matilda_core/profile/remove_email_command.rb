# frozen_string_literal: true

module MatildaCore

  module Profile

    # RemoveEmailCommand.
    class RemoveEmailCommand < MatildaCore::ApplicationCommand

      validates :user_uuid,
                presence: true, type: :string, blank: false,
                err: 'Utente non valido'

      validates :email,
                presence: true, type: :string, blank: false,
                err: 'Nome non valido'

      validates :log_who, type: :string

      to_validate_logic do
        # verifico che l'utente esista
        unless MatildaCore::User.find_by(uuid: params[:user_uuid])
          err('Utente non valido', code: :user_uuid)
          break
        end

        # verifico che la email esista
        unless MatildaCore::UserEmail.find_by(user_uuid: params[:user_uuid], email: params[:email])
          err('Email non esistente', code: :email)
          break
        end

        # verifico che non si tratti dell'ultima email dell'utente
        unless MatildaCore::UserEmail.where(user_uuid: params[:user_uuid]).length > 1
          err("Non puoi eliminare tutte le email associate all'account", code: :email)
          break
        end
      end

      to_initialize_events do
        event = MatildaCore::Users::RemoveEmailEvent.new(
          user_uuid: params[:user_uuid],
          email: params[:email],
          log_who: params[:log_who]
        )
        internal_error && break unless event.saved?
      end

    end

  end

end
