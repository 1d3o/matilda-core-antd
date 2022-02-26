# frozen_string_literal: true

module MatildaBoilerplate

  # Engine.
  class Engine < ::Rails::Engine

    isolate_namespace MatildaBoilerplate

    # Imposto le voci della sidebar utilizzando la configurazione dell'engine.
    initializer 'matilda_boilerplate.add_sidebar_items', after: :add_routing_paths do |_app|
      Rails.application.reload_routes!

      # MatildaCore.config.add_sidebar_item(
      #   # ...
      # )
    end

    # Imposto i permessi degli utenti.
    initializer 'matilda_boilerplate.add_memberships_permissions' do |_app|
      # MatildaCore.config.add_memberships_permission(
      #   # ...
      # )
    end

    # Imposto i ruoli degli utenti.
    initializer 'matilda_boilerplate.add_memberships_permissions_roles' do |_app|
      # MatildaCore.config.add_memberships_permissions_role(
      #   # ...
      # )
    end

  end

end
