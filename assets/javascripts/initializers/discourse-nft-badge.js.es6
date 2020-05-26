import { withPluginApi } from "discourse/lib/plugin-api";

function initializeDiscourseNftBadge(api) {
  // BROKEN LINK: https://github.com/discourse/discourse/blob/master/app/assets/javascripts/discourse/lib/plugin-api.js.es6
  // https://github.com/discourse/discourse/blob/master/app/assets/javascripts/discourse/app/lib/plugin-api.js

  console.log("NFT Badge plugin loaded");
  console.log("User", api.getCurrentUser());
}

export default {
  name: "discourse-nft-badge",

  initialize() {
    withPluginApi("0.8.31", initializeDiscourseNftBadge);
  }
};
