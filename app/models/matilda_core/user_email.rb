# frozen_string_literal: true

module MatildaCore

  # UserEmail.
  class UserEmail < ApplicationRecord

    belongs_to :user, foreign_key: :user_uuid, optional: true

  end

end
