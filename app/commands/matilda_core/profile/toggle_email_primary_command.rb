# frozen_string_literal: true

module MatildaCore

  module Profile

    # ToggleEmailPrimaryCommand.
    class ToggleEmailPrimaryCommand < MatildaCore::ApplicationCommand

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

        # verifico che la email esista
        unless MatildaCore::UserEmail.find_by(user_uuid: params[:user_uuid], email: params[:email])
          err('Email non esistente', code: :email)
          break
        end
      end

      to_initialize_events do
        # imposto tutte le altre email a non primarie
        MatildaCore::UserEmail.where(user_uuid: params[:user_uuid]).where(primary: true).each do |user_email|
          MatildaCore::Users::EditEmailPrimaryEvent.new(
            user_uuid: params[:user_uuid],
            email: user_email.email,
            primary: false,
            log_who: params[:log_who]
          )
        end

        # aggiorno la mail richiesta a primaria
        event = MatildaCore::Users::EditEmailPrimaryEvent.new(
          user_uuid: params[:user_uuid],
          email: params[:email],
          primary: true,
          log_who: params[:log_who]
        )
        internal_error && break unless event.saved?
      end

    end

  end

end
