module DiscourseNftBadge
  class Engine < ::Rails::Engine
    engine_name "DiscourseNftBadge".freeze
    isolate_namespace DiscourseNftBadge

    config.after_initialize do
      Discourse::Application.routes.append do
        mount ::DiscourseNftBadge::Engine, at: "/discourse-nft-badge"
      end
    end
  end
end
