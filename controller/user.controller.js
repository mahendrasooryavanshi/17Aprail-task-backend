const userService = require("../services/user.services");
const tokenMiddleware = require("../middleware/tokenMiddleware/authToken");
const bcrypt = require("bcrypt");
const userController = {
  signIn: async (req, res) => {
    let name = req.body.name ? req.body.name : "";
    let email = req.body.email ? req.body.email : "";
    let password = req.body.password ? req.body.password : "";
    let age = req.body.age ? Number(req.body.age) : "";
    let data = { name, email, age, password };
    let response = {};
    try {
      let isUserExist = await userService.findOneUser({
        email: email,
        deletedAt: null,
      });
      if (isUserExist) {
        res.statusCode = 402;
        response.error = "EXISTED_USER";
        response.errorMessage = "this email is already existed...";
        return res.json(response);
      }
      let check = {};
      let user = await userService.findUser(check);
      let hasPassword = await bcrypt.hashSync(password, 10);
      let l = user.length;
      let _id = l == 0 ? 1 : user[l - 1]._id + 1;
      let result = await userService.create({
        ...data,
        _id,
        password: hasPassword,
        isLogin: true,
      });
      if (!result) {
        response.statusCode = 504;
        response.error = "ServerError";
        response.message = "Something went wrong";
        return res.json(response);
      }
      let payload = {
        _id: result.id,
        email: result.email,
        status: result.status,
        role: "user",
        tokenType: "Bearer",
      };
      const accessToken = await tokenMiddleware.generateAccessToken(payload);
      const refreshToken = await tokenMiddleware.generateRefreshToken(payload);
      res.header("Authorization", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      let token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        type: "Bearer",
        status: result.status,
      };
      response.message = "user created successfully";
      response.tokenInfo = token;
      return res.json(response);
    } catch (error) {
      console.log(error, "ERR");
      return res.json({ error: error });
    }
  },

  logIn: async (req, res) => {
    let email = req.body.email ? req.body.email : "";
    let password = req.body.password ? req.body.password : "";
    let response = {};
    try {
      let check = { email: email, deletedAt: null };
      let user = await userService.findOneUser(check);
      if (!user) {
        res.statusCode = 404;
        response.error = "NOT_FOUND_ERROR";
        response.errorMessage = "user not found";
        return res.json(response);
      }

      let checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        res.statusCode = 404;
        response.error = "VALIDATION_TYPE_ERROR";
        response.errorMessage = "you have entered wrong password";
        return res.json({ Error: response });
      }
      let payload = {
        _id: user.id,
        email: user.email,
        status: user.status,
        role: "user",
        tokenType: "Bearer",
      };
      const login = await userService.findOneAndUpdate(
        { _id: user.id },
        { isLogin: true }
      );

      const accessToken = await tokenMiddleware.generateAccessToken(payload);
      const refreshToken = await tokenMiddleware.generateRefreshToken(payload);

      res.header("Authorization", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      res.statusCode = 201;
      response.Message = "user logged in successfully";
      let tokenInfo = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        type: "Bearer",
      };
      response.tokenInfo = tokenInfo;
      console.log(response);
      return res.json({ result: response });
    } catch (error) {
      console.log(error, "_____________ERR");
      return res.json({ error: error });
    }
  },

  updateUser: async (req, res) => {
    const _id = req.params.id ? Number(req.params.id) : "";
    let login_user = res.token._id;
    let response = {};
    try {
      const is_user_Login = await userService.findOneUser({
        _id: login_user,
        deletedAt: null,
        isLogin: true,
      });
      if (!is_user_Login) {
        res.statusCode = 402;
        response.error = "NOT_VALID_USER";
        response.errorMessage = "please login first";
        return res.json(response);
      }

      let data = { updatedAt: new Date() };
      if (req.body.name) {
        data.name = req.body.name;
      }
      if (req.body.email) {
        data.email = req.body.email;
      }
      if (req.body.age) {
        data.age = req.body.age;
      }

      const filter = { deletedAt: null, _id: _id };
      const exclude = { password: 0, __v: 0, deletedAt: 0, __v: 0 };
      let user = await userService.findOneAndUpdate(filter, data, exclude);
      if (!user) {
        response.statusCode = 404;
        response.errorMessage = "user not found";
        return res.json(response);
      }
      response.statusCode = 201;
      response.message = "user updated successfully";
      response.updatedUser = user;
      return res.json(response);
    } catch (error) {}
  },
  getAllUsers: async (req, res) => {
    try {
      let userId = res.token._id;
      let response = {};
      data = {
        deletedAt: null,
      };

      const exclude = { password: 0, __v: 0, deletedAt: 0 };
      let all_user = await userService.getAll_user(data, exclude);
      if (all_user.length <= 0) {
        response.statusCode = 404;
        response.message = "No Records Found";
        return res.json({ Error: response });
      }
      response.statusCode = 201;
      response.count = all_user.length;
      response.results = all_user;
      return res.json(response);
    } catch (error) {
      console.log(error.message);
    }
  },
  specific_user: async (req, res) => {
    const id = req.params.id ? Number(req.params.id) : "";
    console.log(id);
    const loginUserId = res.token._id;
    let response = {};
    try {
      const is_user_Login = await userService.findOneUser({
        _id: loginUserId,
        deletedAt: null,
        isLogin: true,
      });
      if (!is_user_Login) {
        res.statusCode = 402;
        response.error = "YOU_HAVE_LOGOUT_ERROR";
        response.errorMessage = "please login first";
        return res.json(response);
      }
      let result = await userService.findOneUser(
        { _id: id, deletedAt: null },
        { password: 0, __v: 0, deletedAt: 0 }
      );

      if (!result) {
        response.statusCode = 404;
        response.error = "NOT_FOUND_ERROR";
        response.message =
          "insert other userId,this id is not existed in database";
        return res.json(response);
      }
      res.status = 201;
      response.message = "user found successfully";
      response.user = result;
      return res.json(response);
    } catch (error) {
      console.log(error);
    }
  },
  delete: async (req, res) => {
    let login_user = res.token._id;
    const _id = req.params.id ? Number(req.params.id) : "";
    let response = {};
    try {
      const is_user_Login = await userService.findOneUser({
        _id: login_user,
        deletedAt: null,
        isLogin: true,
      });
      if (!is_user_Login) {
        res.statusCode = 402;
        response.error = "NOT_VALID_USER";
        response.errorMessage = "please login first";
        return res.json(response);
      }
      const is_Id = await userService.findOneUser({
        deletedAt: null,
        _id: _id,
      });
      if (!is_Id) {
        response.statusCode = 404;
        response.error = "Not_found";
        response.message = "user id is not found";
        return res.json(response);
      }
      let result = await userService.delete({ deletedAt: null, _id: _id });
      if (!result) {
        res.status = 504;
        response.error = "Something_wrong";
        response.message = "Server error,something went wrong";
      }
      res.status = "Success";
      response.statusCode = 201;
      response.message = "user deleted successfully";
      return res.json(response);
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = userController;
