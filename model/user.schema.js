const mongoose = require("mongoose");
const UniqueValidator = require("mongoose-unique-validator");
const UserSchema = new mongoose.Schema(
  {
    _id: {
      primaryKey: true,
      type: Number,
      alias: "id",
    },
    name: {
      type: String,
      allowNull: false,
      lowercase: true,
      trim: true,
    },
    age: {
      type: Number,
      allowNull: false,
    },
    status: {
      type: String,
      allowNull: false,
      defaultValue: "active",
      lowercase: true,
    },
    email: {
      type: String,
      allowNull: false,
      minLength: 8,
      unique: true,
      lowercase: true,
    },
    isLogin: {
      type: Boolean,
      allowNull: false,
      defaultValue: false,
    },
    password: {
      type: String,
      allowNull: false,
      trim: true,
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
UserSchema.plugin(UniqueValidator);

// compile schema to model
const User = new mongoose.model("User", UserSchema);
module.exports = User;
