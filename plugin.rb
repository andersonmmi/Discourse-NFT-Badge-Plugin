# frozen_string_literal: true

# name: DiscourseNftBadge
# about: This plugin will unlock badges in discourse based on NFTs owned by a user's Ethereum address
# version: 0.1
# authors: andersonmmi, morganstar
# url: https://github.com/andersonmmi/Discourse-NFT-Badge-Plugin

register_asset 'stylesheets/common/discourse-nft-badge.scss'
register_asset 'stylesheets/desktop/discourse-nft-badge.scss', :desktop
register_asset 'stylesheets/mobile/discourse-nft-badge.scss', :mobile

register_asset "javascripts/discourse/templates/connectors/user-custom-controls/link-wallet-button.hbs"

enabled_site_setting :discourse_nft_badge_enabled

PLUGIN_NAME ||= 'DiscourseNftBadge'

load File.expand_path('lib/discourse-nft-badge/engine.rb', __dir__)

after_initialize do
  # https://github.com/discourse/discourse/blob/master/lib/plugin/instance.rb

  # @Aaron: Attempting to store date-time of today()
  def self.key_for(user_id)
    "notes:#{user_id}"
  end

  def self.notes_for(user_id)
    PluginStore.get('user_notes', key_for(user_id)) || []
  end
  
  def self.add_note(user, raw, created_by, opts = nil)
    opts ||= {}

    notes = notes_for(user.id)
    record = {
      id: SecureRandom.hex(16),
      user_id: user.id,
      raw: raw,
      created_by: created_by,
      created_at: Time.now
    }.merge(opts)

    notes << record
    ::PluginStore.set("user_notes", key_for(user.id), notes)

    user.custom_fields[COUNT_FIELD] = notes.size
    user.save_custom_fields

    record
  end

end

# PluginStoreRow, UserCustomField, and UserBadge are all classes which inherit from ActiveRecord
# https://meta.discourse.org/t/how-to-write-a-ruby-code-that-add-a-new-users-data-to-a-user-custom-fields/66662/4
#
# Based on the user_note example plugin, it seems the appropriate way to save user specific data, ie Ethereum
# Addresses, to the database involves:
# - adding a row to `user_custom_fields` indicating how many addresses the user has
# - adding a row to `plugin_store_rows` with a 'key' field specifying the user_id and a JSON value containing an
#   array of objects, each being an Ethereum address definition
#
# HOWEVER, this approach seems awkward and cumbersome and loses some relational-database qualities by storing
# data inside JSON structures.  It seems like one or both of those tables should be used, but with a somewhat
# different approach (different approach still pending....)
#
# THEN AGAIN, the JSON structure would allow saving signatures (proofs) alongside ethereum addresses.  And this
# data should get queried on typical page loads, so perfect relational capabilities may be unnecessary.
#
#
# Using that structure would look something like this in Ruby
# (NOTE: some of this may be INVALID Ruby, treat as pseudo-code):
#
#    Save a record that there is a known Ethereum address for the user:
#      userAddressCount = UserCustomField.create(user_id: currentUser.id, name: "ethereum_address_count", value: "1")
#
#    Load the number of known Ethereum addresses for the user:
#      userAddressCount = UserCustomField.where(name: "ethereum_address_count", user_id: currentUser.id).first
#      userAddressCount.value
#
#    Modify and store the updated value:
#      userAddressCount.value = "2"
#      userAddressCount.save
#
#    Save record with details of known Ethereum address:
#      address1 = {id: 1, address: userEthereumAddress, signature: userSignature, created_by: currentUser.id, created_at: timestamp}
#      addressData = [address1]
#      userEthereumAddresses = PluginStoreRows.create(plugin_name: "discourse_nft_badge", key: "user:#{currentUser.id}", type_name: "JSON", value: addressData.jsonStringify)
#
#    Load record of all known Ethereum addresses for given user (stored in a JSON encoded array of objects):
#      userEthereumAddresses = PluginStoreRows.where(plugin_name: "discourse_nft_badge", key: "user:#{currentUser.id}").first
#      userEthereumAddresses = PluginStore.get('discourse_nft_badge', "user:#{currentUser.id}") || []
#      addressData = userEthereumAddresses.value.jsonParse
#
#    Modify and save the record with an additional address:
#      address2 = {id: 2, address: userEthereumAddress2, signature: userSignature2, created_by: currentUser.id, created_at: timestamp}
#      addressData.push(address2)
#      userEthereumAddresses.value = addressData.jsonStringify
#      userEthereumAddresses.save

# add_admin_route 'purple_tentacle.title', 'purple-tentacle'
add_admin_route 'nft_badges.title', 'nft-badges'

Discourse::Application.routes.append do
  # get 'admin/plugins/purple-tentacle' => 'admin/plugins#index', constraints: StaffConstraint.new
  get 'admin/plugins/nft-badges' => 'admin/plugins#index', constraints: StaffConstraint.new
end



# Discourse::Application.routes.append do
#   get '/admin/plugins/nft-badges' => 'admin/plugins#index', constraints: StaffConstraint.new
# end