class DiscourseNftBadgeConstraint
  def matches?(request)
    SiteSetting.discourse_nft_badge_enabled
  end
end
