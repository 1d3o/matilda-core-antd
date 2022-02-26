# frozen_string_literal: true

module MatildaCore

  module Profile

    # CreateEmailCommand.
    class CreateEmailCommand < MatildaCore::ApplicationCommand

      validates :user_uuid,
                presence: true, type: :string, blank: false,
                err: 'Utente non valido'

      validates :email,
                presence: true, type: :string, blank: false,
                regex: MatildaCore::User::EMAIL_REGEX,
                err: 'Nome non valido'

      validates :log_who, type: :string

      to_validate_logic do
        # verifico che l'utente esista
        unless MatildaCore::User.find_by(uuid: params[:user_uuid])
          err('Utente non valido', code: :user_uuid)
          break
        end

        # verifico che la email sia univoca
        if MatildaCore::UserEmail.find_by(email: params[:email])
          err('Email già utilizzata', code: :email)
          break
        end
      end

      to_initialize_events do
        event = MatildaCore::Users::CreateEmailEvent.new(
          user_uuid: params[:user_uuid],
          email: params[:email],
          primary: false,
          log_who: params[:log_who]
        )
        internal_error && break unless event.saved?
      end

    end

  end

end
