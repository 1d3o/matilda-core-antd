# frozen_string_literal: true

module MatildaCore

  # ReactHelper.
  module ReactHelper

    def matilda_react_view(module_name, props = {})
      react_component "#{module_name}/views/#{controller_name}/#{action_name}/index", {
        matilda: matilda_react_props
      }.merge(props) if defined?(react_component)
    end

    ##############################################################################################################################

    def matilda_react_props
      {
        i18n: {
          available_locales: I18n.available_locales,
          locale: I18n.locale,
          translations: matilda_react_props_react_props_i18n_translations
        },
        router: {
          routes: matilda_react_props_react_props_router_routes,
          route_controller: controller_name,
          route_action: action_name,
        },
        config: MatildaCore.config.as_json,
        session: @session&.data
      }
    end

    ##############################################################################################################################

    def matilda_react_props_react_props_router_routes
      def get_routes
        router_routes = {}

        # add routes from main application
        Rails.application.routes.routes.each do |route|
          has_gem = false
          route_name = route.name
          route_path = route.path.spec.to_s.gsub('(.:format)', '')
          route_path = '' if route_path == '/'
          route_method = route.verb.upcase

          Rails::Engine.subclasses.each do |subclass|
            subclass_name = subclass.module_parent.name.underscore
          
            if route_name == subclass_name
              has_gem = true
              subclass.instance.routes.routes.each do |subclass_route|
                subclass_route_name = subclass_route.name
                subclass_route_path = subclass_route.path.spec.to_s.gsub('(.:format)', '')
                subclass_route_method = subclass_route.verb.upcase
                router_routes["#{subclass_name}.#{subclass_route_name}"] = { path: "#{route_path}#{subclass_route_path}", method: subclass_route_method }
              end
            end
          end

          router_routes[route_name] = { path: route_path, method: route_method } unless has_gem
        end

        router_routes
      end

      return get_routes if Rails.env.development?

      Rails.cache.fetch("MatildaCore::ReactHelper.matilda_react_props_react_props_router_routes") do
        get_routes
      end
    end

    def matilda_react_props_react_props_i18n_translations
      def flatten_hash(param, prefix=nil)
        param.each_pair.reduce({}) do |a, (k, v)|
          v.is_a?(Hash) ? a.merge(flatten_hash(v, "#{prefix}#{k}.")) : a.merge("#{prefix}#{k}".to_sym => v)
        end
      end

      def get_translations
        flatten_hash(I18n.t('.')[:matilda])
      end

      return get_translations if Rails.env.development?

      Rails.cache.fetch("MatildaCore::ReactHelper.matilda_react_props_react_props_i18n_translations(#{I18n.locale})") do
        get_translations
      end
    end

  end

end
