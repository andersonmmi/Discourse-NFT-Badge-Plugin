require_dependency "discourse_nft_badge_constraint"

DiscourseNftBadge::Engine.routes.draw do
  get "/" => "discourse_nft_badge#index", constraints: DiscourseNftBadgeConstraint.new
  get "/actions" => "actions#index", constraints: DiscourseNftBadgeConstraint.new
  get "/actions/:id" => "actions#show", constraints: DiscourseNftBadgeConstraint.new
end
