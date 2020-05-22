module DiscourseNftBadge
  class DiscourseNftBadgeController < ::ApplicationController
    requires_plugin DiscourseNftBadge

    before_action :ensure_logged_in

    def index
    end
  end
end
