const mongoose = require("mongoose");
const permissions = [
  "feed_c",
  "feed_r",
  "feed_u",
  "feed_d",
  "profile_c",
  "profile_u",
  "profile_r",
  "profile_d",
  "article_a",
  "article_c",
  "article_u",
  "article_r",
  "article_d",
  "travelplan_c",
  "travelplan_u",
  "travelplan_r",
  "travelplan_d",
  "crypto_c",
  "crypto_r",
  "crypto_u",
  "crypto_d"
];

const Role = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    permissions: {
      type: [String],
      required: true,
      default: [],
      enum: permissions,
    },
    // permissions can include values like feed_c, feed_r, feed_u, feed_d, article_c, article_r, article_u, article_d
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Role", Role);
