# frozen_string_literal: true

$LOAD_PATH.push File.expand_path('lib', __dir__)

# Maintain your gem's version:
require 'matilda_core/version'

# Describe your gem and declare its dependencies:
Gem::Specification.new do |spec|
  spec.name        = 'matilda_core'
  spec.version     = MatildaCore::VERSION
  spec.authors     = ['Gregorio Galante']
  spec.email       = ['me@gregoriogalante.com']
  spec.homepage    = 'https://gregoriogalante.com/'
  spec.summary     = 'Summary of MatildaCore.'
  spec.description = 'Description of MatildaCore.'
  spec.license     = 'MIT'

  spec.files = Dir['{app,config,db,lib}/**/*', 'MIT-LICENSE', 'Rakefile', 'README.md']

  spec.add_dependency 'bcrypt'
  spec.add_dependency 'evnt'
  spec.add_dependency 'jwt'
  spec.add_dependency 'kaminari'
  spec.add_dependency 'rest-client'
  spec.add_dependency 'rails'

  spec.add_development_dependency 'rails'
  spec.add_development_dependency 'sqlite3'
end
