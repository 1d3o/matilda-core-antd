# frozen_string_literal: true

module MatildaBoilerplate

  # ApplicationMailer.
  class ApplicationMailer < MatildaCore::ApplicationMailer

    layout 'matilda_core/mailer'
    default from: MatildaCore.config.mailer_from_address
    default template_path: 'matilda_core/mailers'

  end

end
