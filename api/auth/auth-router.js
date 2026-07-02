const router = require("express").Router();
const bcrypt = require("bcryptjs");

const users = require("../users/users-model");

const {
  usernameBostami,
  usernameVarmi,
  sifreGecerlimi,
} = require("./auth-middleware");

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status: 201
  {
    "user_id": 2,
    "username": "sue"
  }

  response username alınmış:
  status: 422
  {
    "message": "Username kullaniliyor"
  }

  response şifre 3 ya da daha az karakterli:
  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
 */

/**
 * Yeni kullanıcı oluşturur.
 * Username'in boşta olup olmadığını kontrol eder.
 * Şifreyi hashleyerek veritabanına kaydeder.
 */
router.post(
  "/register",
  usernameBostami,
  sifreGecerlimi,
  async (req, res, next) => {
    try {
      const user = {
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8),
      };

      const yeniKullanici = await users.ekle(user);

      res.status(201).json(yeniKullanici);
    } catch (err) {
      next(err);
    }
  }
);

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status: 200
  {
    "message": "Hoşgeldin sue!"
  }

  response geçersiz kriter:
  status: 401
  {
    "message": "Geçersiz kriter!"
  }
 */

/**
 * Kullanıcının giriş yapmasını sağlar.
 * Username'in veritabanında olup olmadığını kontrol eder.
 * Şifre doğruysa session oluşturur.
 */
router.post(
  "/login",
  usernameVarmi,
  async (req, res, next) => {
    try {
      const { password } = req.body;

      if (bcrypt.compareSync(password, req.user.password)) {
        req.session.user = {
          user_id: req.user.user_id,
          username: req.user.username,
        };

        res.status(200).json({
          message: `Hoşgeldin ${req.user.username}!`,
        });
      } else {
        res.status(401).json({
          message: "Geçersiz kriter!",
        });
      }
    } catch (err) {
      next(err);
    }
  }
);

/**
  3 [GET] /api/auth/logout

  response giriş yapmış kullanıcılar için:
  status: 200
  {
    "message": "Çıkış yapildi"
  }

  response giriş yapmamış kullanıcılar için:
  status: 200
  {
    "message": "Oturum bulunamadı!"
  }
 */

/**
 * Kullanıcının oturumunu sonlandırır.
 */
router.get("/logout", (req, res, next) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({
          message: "Çıkış yapildi",
        });
      }
    });
  } else {
    res.status(200).json({
      message: "Oturum bulunamadı!",
    });
  }
});

module.exports = router;