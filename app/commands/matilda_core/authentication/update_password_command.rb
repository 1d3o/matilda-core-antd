# frozen_string_literal: true

module MatildaCore

  module Authentication

    # UpdatePasswordCommand.
    class UpdatePasswordCommand < MatildaCore::ApplicationCommand

      validates :user_uuid,
                presence: true, type: :string, blank: false,
                err: 'User non valido'

      validates :recover_password_code,
                presence: true, type: :string, blank: false,
                err: 'Codice non valido'

      validates :password,
                presence: true, type: :string, blank: false,
                err: 'Password non valida' # TODO: Aggiungere Regex password.

      validates :password_confirmation,
                presence: true, type: :string, blank: false,
                err: 'Password non valida' # TODO: Aggiungere Regex password.

      validates :log_who, type: :string

      to_validate_params do
        # verifico che le due password coincidano
        unless params[:password] == params[:password_confirmation]
          err('Le due password non coincidono', code: :password_confirmation)
          break
        end
      end

      to_validate_logic do
        user = MatildaCore::User.find_by(uuid: params[:user_uuid])

        # verifico che l'utente esista
        unless user
          err('User non valido', code: :user_uuid)
          break
        end

        # verifico che il codice sia valido
        if user.recover_password_code.blank? || user.recover_password_code != params[:recover_password_code]
          err('Codice non valido', code: :recover_password_code)
          break
        end

        # verifico che il codice non sia scaduto
        unless user.recover_password_code_time >= Time.now - 30.minutes
          err('Codice scaduto', code: :recover_password_code)
          break
        end
      end

      to_initialize_events do
        # imposto la nuova password all'utente
        event_password = MatildaCore::Users::EditPasswordEvent.new(
          user_uuid: params[:user_uuid],
          password: BCrypt::Password.create(params[:password]),
          log_who: params[:log_who]
        )
        internal_error && break unless event_password.saved?
      end

    end

  end

end
