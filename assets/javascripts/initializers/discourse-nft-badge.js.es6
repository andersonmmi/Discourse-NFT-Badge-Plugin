import { withPluginApi } from "discourse/lib/plugin-api";

function initializeDiscourseNftBadge(api) {
  // BROKEN LINK: https://github.com/discourse/discourse/blob/master/app/assets/javascripts/discourse/lib/plugin-api.js.es6
  // https://github.com/discourse/discourse/blob/master/app/assets/javascripts/discourse/app/lib/plugin-api.js

  console.log("NFT Badge plugin loaded");
  let currentUser = api.getCurrentUser();
  console.log("User", currentUser);  // TODO: DELETE THIS LINE - JUST FOR DEBUGGING
  // Some notable properties of currentUser:
  // .admin (boolean)
  // .custom_fields (object, custom class maybe?)
  // .displayName (string)
  // .id (integer)
  // .keyValueStore (?, undefined by default)
  // .staff (boolean)
  // .username (string)
  // .username_lower (string)

  console.log("aaron's branch has loaded");

}

export default {
  name: "discourse-nft-badge",

  initialize() {
    withPluginApi("0.8.31", initializeDiscourseNftBadge);
  }
};
