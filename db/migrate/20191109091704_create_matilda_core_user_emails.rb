class CreateMatildaCoreUserEmails < ActiveRecord::Migration[6.0]
  def change
    create_table :matilda_core_user_emails, id: false do |t|
      t.string :email, primary_key: true
      t.string :user_uuid
      t.boolean :primary
      t.boolean :confirmed
      t.timestamps
    end
  end
end
