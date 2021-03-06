# frozen_string_literal: true

module MatildaCore

  # Engine.
  class Engine < ::Rails::Engine

    isolate_namespace MatildaCore

    # Imposto le voci della sidebar utilizzando la configurazione dell'engine.
    initializer 'matilda_core.add_sidebar_items', after: :add_routing_paths do |_app|
      Rails.application.reload_routes!

      MatildaCore.config.add_sidebar_item(
        'matilda_core.memberships',
        label: 'titles.users',
        url: MatildaCore::Engine.routes.url_helpers.memberships_index_view_path,
        icon_legacy: 'fas fa-users',
        icon: 'UsergroupAddOutlined',
        permission: 'matilda_core.memberships',
        index: 1100
      )
    end

    # Imposto i permessi degli utenti.
    initializer 'matilda_core.add_memberships_permissions' do |_app|
      MatildaCore.config.add_memberships_permission(
        'matilda_core.memberships',
        label: 'strings.manage_users_permission',
        index: 0,
        group: 'titles.administration'
      )
    end

    # Imposto i ruoli degli utenti.
    initializer 'matilda_core.add_memberships_permissions_roles' do |_app|
      MatildaCore.config.add_memberships_permissions_role(
        'matilda_core.administrator',
        label: 'strings.administrator',
        index: 0,
        permissions: ['matilda_core.memberships']
      )
      MatildaCore.config.add_memberships_permissions_role(
        'matilda_core.none',
        label: 'strings.none',
        index: 0,
        permissions: []
      )
    end

  end

end
