import { body, check } from "express-validator";
import User from "../models/user.js";

//kayıt ol sayfasında kullanıcı kaydolurken kaydolma kriterleri.
export const registerValidation = () => [
  body("username")
    .isLength({ min: 3 })
    .withMessage("Kullanıcı adı en az 3 karakter olmadılır.")
    .isAlphanumeric()
    .withMessage("Kullanıcı adı sadece sayı ve harflerden oluşmalıdır.")
    .custom((value) => {
      return User.findByUsername(value).then((user) => {
        if (user) {
          return Promise.reject("userna already in use");
        }
      });
    }),
  body("email")
    .isEmail()
    .withMessage("Geçerli bir e-posta adresi girin")
    //Custom email kontrol
    .custom((value) => {
      return User.findByEmail(value).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    }),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Şifre en az 6 karakter olmalıdır"),
  body("passwordConfirmation").custom((value, { req }) => {
    if (value != req.body.password) {
      throw new Error("Şifre dogrulama eşleşmiyor");
    }
    return true;
  }),
  check("avatar").custom((value, { req }) => {
    if (!req?.files?.avatar) {
      throw new Error("Profil Resmi yüklenmelidir");
    }
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    const profileImage = req.files.avatar;
    if (!allowedMimeTypes.includes(profileImage.mimetype)) {
      throw new Error(
        "Sadece .jpeg,.png ve .gif formatlarında dosya yükleyebilirsiniz."
      );
    }
    if (profileImage.size > 5 * 1024 * 1024) {
      throw new Error("Dosya bboyutu 5 mb'ı geçemez");
    }
    return true;
  }),
];
