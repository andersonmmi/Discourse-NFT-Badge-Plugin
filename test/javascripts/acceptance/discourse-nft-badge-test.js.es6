import { acceptance } from "helpers/qunit-helpers";

acceptance("DiscourseNftBadge", { loggedIn: true });

test("DiscourseNftBadge works", async assert => {
  await visit("/admin/plugins/discourse-nft-badge");

  assert.ok(false, "it shows the DiscourseNftBadge button");
});
