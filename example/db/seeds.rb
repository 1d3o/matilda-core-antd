# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Creo il gruppo di default
group = MatildaCore::Group.create(
  uuid: 'demo',
  name: 'Demo'
)

# Creo l'admin di default
user = MatildaCore::User.create(
  uuid: 'demo',
  username: 'demo',
  name: 'Demo',
  surname: 'Demo',
  password: BCrypt::Password.create('Password1!')
)
MatildaCore::UserEmail.create(
  user_uuid: 'demo',
  email: 'dev@mail.com'
)

# Assegno l'admin al gruppo
membership = MatildaCore::Membership.create(
  user_uuid: 'demo',
  group_uuid: 'demo',
  permissions: MatildaCore.config.memberships_permissions_roles.select { |r| r[:name] == 'matilda_core.administrator' }.first[:permissions]
)

# Creo N utenti demo assegnati al gruppo
150.times do |index|
  uuid = "user_demo_#{index}"

  MatildaCore::User.create(
    uuid: uuid,
    username: uuid,
    name: Faker::Name.first_name,
    surname: Faker::Name.last_name,
    password: BCrypt::Password.create('Password1!')
  )
  MatildaCore::UserEmail.create(
    user_uuid: uuid,
    email: Faker::Internet.email
  )
  MatildaCore::Membership.create(
    user_uuid: uuid,
    group_uuid: group.uuid,
    permissions: []
  )
end
