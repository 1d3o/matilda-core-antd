# frozen_string_literal: true

module MatildaCore

  # UserSession.
  class UserSession < ApplicationRecord

    belongs_to :user, foreign_key: :user_uuid, optional: true

  end

end
