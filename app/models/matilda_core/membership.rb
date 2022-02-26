# frozen_string_literal: true

module MatildaCore

  # Membership.
  class Membership < ApplicationRecord

    belongs_to :user, foreign_key: :user_uuid, optional: true
    belongs_to :group, foreign_key: :group_uuid, optional: true

    serialize :permissions, Array

    def permissions_role
      permissions_role = MatildaCore.config.memberships_permissions_roles.select { |r| r[:permissions].sort == permissions.sort }.first
      permissions_role ? permissions_role[:name] : nil
    end

    def as_json
      base = super
      base[:permissions_role] =permissions_role
      base
    end

  end

end
