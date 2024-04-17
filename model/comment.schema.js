// const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const UniqueValidator = require("mongoose-unique-validator");
const CommentSchema = new mongoose.Schema(
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
    },
    postId: {
      type: Number,
      allowNull: false,
      ref: "Post",
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
CommentSchema.plugin(UniqueValidator);

// compile schema to model
const Post = mongoose.model("Post", CommentSchema);
module.exports = Post;
