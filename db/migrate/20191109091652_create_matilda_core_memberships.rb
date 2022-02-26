class CreateMatildaCoreMemberships < ActiveRecord::Migration[6.0]
  def change
    create_table :matilda_core_memberships do |t|
      t.string :group_uuid
      t.string :user_uuid
      t.text :permissions
      t.timestamps
    end
  end
end
