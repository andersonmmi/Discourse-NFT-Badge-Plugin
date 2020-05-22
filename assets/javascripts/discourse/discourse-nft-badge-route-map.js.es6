export default function() {
  this.route("discourse-nft-badge", function() {
    this.route("actions", function() {
      this.route("show", { path: "/:id" });
    });
  });
};
