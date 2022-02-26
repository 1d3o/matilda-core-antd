# frozen_string_literal: true

namespace :matilda_boilerplate do

  #################################################################################

  namespace :install do

    # *****************************************************************************

    desc "Installa le dipendenze front-end dall'engine all'applicazione principale"
    task front: :environment do |_task, args|
      # copy front module to main application
      src = "#{MatildaBoilerplate::Engine.root}/front"
      dst = "#{Rails.root}/app/javascript/matilda_boilerplate"
      FileUtils.rm_rf(dst) if File.exist?(dst)
      FileUtils.copy_entry(src, dst)

      # install dependencies inside main applicaiton
      dependencies = JSON.parse(File.read("#{dst}/dependencies.json"))
      system("yarn add #{dependencies['dependencies'].join(' ')}")

      puts "IMPORTANTE: Aggiungere il modulo come nuovo require context sul file matilda.js"
      puts "IMPORTANTE: Aggiungere 'vendor/matilda_boilerplate' tra le additional_paths nel file di configurazione webpacker.yml"
    end

    # *****************************************************************************

  end

  #################################################################################

  namespace :generator do

    # ...

  end

  #################################################################################

end
