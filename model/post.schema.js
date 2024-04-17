// const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const UniqueValidator = require("mongoose-unique-validator");
const PostSchema = new mongoose.Schema(
  {
    _id: {
      autoIncrement: true,
      primaryKey: true,
      type: Number,
      alias: "id",
    },
    title: {
      type: String,
      allowNull: false,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      allowNull: false,
      defaultValue: "Active",
      lowercase: true,
    },
    userId: {
      type: Number,
      allowNull: false,
      ref: "User",
      alias: "user_id",
    },
    like: {
      type: Number,
      allowNull: true,
      default: 0,
    },
    reported: {
      type: Number,
      default: 0,
      allowNull: true,
    },
    comment: {
      type: String,
      default: null,
      allowNull: true,
    },
    views: {
      type: Number,
      allowNull: true,
      default: 0,
    },
    createdAt: {
      type: Date,
      defaultValue: Date.now,
      alias: "created_at",
    },
    updatedAt: {
      type: Date,
      defaultValue: Date.now,
      alias: "updated_at",
    },
    deletedAt: {
      type: Date,
      default: null,
      alias: "deleted_at",
    },
  },
  { timestamps: true }
);
// apply the unique validator plugin to register
PostSchema.plugin(UniqueValidator);

// compile schema to model
const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
