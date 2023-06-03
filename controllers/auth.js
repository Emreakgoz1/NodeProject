import { validationResult } from "express-validator";
import slugify from "slugify";
import User from "../models/user.js";
import { response } from "express";
import { encrypt } from "../utils/crypto.js";

export const getLoginController = (req, res) => {
  res.render("auth/login");
};

export const postLoginController = async (req, res, next) => {
  const { username, password } = req.body;
  res.locals.formData = req.body;
  let error;
  if (!username) {
    error = "Kullanıcı adı boş olamaz";
  } else if (!password) {
    error = "Password boş olamaz";
  } else {
    try {
      const user = await User.login(username, password);
      if (user) {
        req.session.username = user.username;
        //database user ıdsini crpyte edip token olarak kullanabilirim
        //ama süresi yok
        req.session.user_id = encrypt(String(user.id));
        res.redirect("/");
      } else {
        error = "Bu bilgilere ait kullanıcı bulunamadı";
      }
    } catch (err) {
      next(err);
    }
  }
  if (error) {
    res.render("auth/login", {
      error,
    });
  }
};

export const logoutController = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

export const getRegisterController = (req, res) => {
  res.render("auth/register");
};

export const postRegisterController = (req, res) => {
  res.locals.formData = req.body;
  const errors = validationResult(req);
  //if (!errors.isEmpty()) {
  //return res.status(400).json({ errors: errors.array() });
  //}
  //hata yoksa
  if (errors.isEmpty()) {
    let avatar = req.files.avatar;
    let path =
      "upload/" +
      Date.now() +
      "-" +
      slugify(avatar.name, { replacement: "_", lower: true });
    avatar.mv(path, async (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      //model yapısı

      const response = await User.create({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        avatar: path,
      });
      const user = await User.findById(response.insertId);
      req.session.username = user.username;
      req.session.user_id = user.id;
      res.redirect("/");
    });
  } else {
    res.render("auth/register", {
      errors: errors.array(),
    });
  }
};
