# frozen_string_literal: true

# name: DiscourseNftBadge
# about: This plugin will unlock badges in discourse based on NFTs owned by a user's Ethereum address
# version: 0.1
# authors: andersonmmi, morganstar
# url: https://github.com/andersonmmi/Discourse-NFT-Badge-Plugin

register_asset 'stylesheets/common/discourse-nft-badge.scss'
register_asset 'stylesheets/desktop/discourse-nft-badge.scss', :desktop
register_asset 'stylesheets/mobile/discourse-nft-badge.scss', :mobile

enabled_site_setting :discourse_nft_badge_enabled

PLUGIN_NAME ||= 'DiscourseNftBadge'

load File.expand_path('lib/discourse-nft-badge/engine.rb', __dir__)

after_initialize do
  # https://github.com/discourse/discourse/blob/master/lib/plugin/instance.rb
end
