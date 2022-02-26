cd example

bundle install
yarn install

rails db:drop
rails db:migrate
rails db:seed

rm -rf ./app/javascript/packs/matilda.js
rails matilda_core:install:front

cd ..