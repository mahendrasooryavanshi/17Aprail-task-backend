const User = require("../model/user.schema");
const userService = {
  findUser: async (data) => {
    try {
      return await User.find(data);
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  findOneUser: async (data, exclude) => {
    try {
      return await User.findOne(data, exclude);
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  create: async (data) => {
    try {
      return await User.create(data);
    } catch (error) {
      return false;
    }
  },
  getAll_user: async (data, exclude) => {
    try {
      return await User.find(data, exclude).sort({ _id: -1 }).exec();
    } catch (error) {
      console.log(error);
    }
  },
  update: async (filter, data) => {
    try {
      return await User.updateOne(filter, { $set: data });
    } catch (error) {
      console.log(error);
    }
  },
  findOneAndUpdate: async (filter, data, exclude) => {
    try {
      return await User.findOneAndUpdate(filter, data, {
        fields: exclude,
        new: true,
      }).exec();
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  delete: async (data) => {
    try {
      return await User.deleteOne(data);
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};
module.exports = userService;
