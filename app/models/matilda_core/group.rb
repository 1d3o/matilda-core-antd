# frozen_string_literal: true

module MatildaCore

  # Group.
  class Group < ApplicationRecord

    has_many :memberships, foreign_key: :group_uuid, dependent: :destroy
    has_many :users, through: :memberships

  end

end
