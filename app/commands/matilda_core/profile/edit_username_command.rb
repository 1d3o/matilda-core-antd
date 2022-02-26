# frozen_string_literal: true

module MatildaCore

  module Profile

    # EditUsernameCommand.
    class EditUsernameCommand < MatildaCore::ApplicationCommand

      validates :user_uuid,
                presence: true, type: :string, blank: false,
                err: 'Utente non valido'

      validates :username,
                presence: true, type: :string, blank: false,
                err: 'Username non valido'

      validates :log_who, type: :string

      to_validate_logic do
        user = MatildaCore::User.find_by(uuid: params[:user_uuid])

        # verifico che l'utente esista
        unless user
          err('Utente non valido', code: :user_uuid)
          break
        end

        # verifico che l'username sia univoco
        if user.username != params[:username] && MatildaCore::User.find_by(username: params[:username])
          err('Username già utilizzato', code: :username)
          break
        end
      end

      to_initialize_events do
        event = MatildaCore::Users::EditUsernameEvent.new(
          user_uuid: params[:user_uuid],
          username: params[:username],
          log_who: params[:log_who]
        )
        internal_error && break unless event.saved?
      end

    end

  end

end
