// `checkUsernameFree`, `checkUsernameExists` ve `checkPasswordLength` gereklidir (require)
// `auth-middleware.js` deki middleware fonksiyonları. Bunlara burda ihtiyacınız var!
const router = require("express").Router();
const bcrypt = require("bcryptjs");

const users = require("../users/users-model");

const {
  usernameBostami,
  usernameVarmi,
  sifreGecerlimi
} = require("./auth-middleware");


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

      const yeniKullanici = await Users.ekle(user);

      res.status(201).json(yeniKullanici);
    } catch (err) {
      next(err);
    }
  }
);


router.post(
  "/login",
  usernameVarmi,
  async (req, res, next) => {
    try{
      const {password} = req.body;

      if(bcrypt.compareSync(password, req,user.password)) {
        req.session.user = {
          user_id: req.user.user_id,
          username: req.user.username,
        }
      }

      res.status(200).json({
        message: "Hoşgeldin ${req.user.username}!"
      });

      res.status(200).json({
        message: "Geçersiz kriter!",
      })
    } catch (err) {
      next(err);
    }
  }
)

router.get("/logout", (req,res,next) => {
  if(req.session.user) {
    req.session.destroy((err) => {
      if(err) {
        next(err);
      } else{
        res.status(200).json({
          message: "Çıkış yapildi",
        })
      }
    })
  }else{
    res.status(200).json({
      message: "Oturum bulunamadı!",
    })
  }
}) 


module.exports = router;
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

 
// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.
