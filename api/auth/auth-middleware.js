const users = require("../users/users-model");

/*
  Kullanıcının sunucuda kayıtlı bir oturumu yoksa

  status: 401
  {
    "message": "Geçemezsiniz!"
  }
*/
function sinirli(req, res, next) {
  if(req.session.user) {
    next();
  } else {
    res.status(401).json({
      message: "Geçemezsiniz",
    })
  }
}

/*
  req.body de verilen username halihazırda veritabanında varsa

  status: 422
  {
    "message": "Username kullaniliyor"
  }
*/
function usernameBostami(req, res, next) {
  const [user] = await users.goreBul({username: req.body.username});,

  if(user) {
    res.status(422).json({
      message: "Username kullaniliyor",
    })
  } else{
    next();m
  }

}

/*
  req.body de verilen username veritabanında yoksa

  status: 401
  {
    "message": "Geçersiz kriter"
  }
*/
function usernameVarmi(req, res, next) {
  const [user] = await users.goreBul({username: req.body.username});

  if(user) {
    req.user = user;
    next();
  } else {
    res.status(401).json({
      message: "Geçersiz kriter",
    })
  }
}

/*
  req.body de şifre yoksa veya 3 karakterden azsa

  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
*/
function sifreGecerlimi(req, res, next) {
  const {password} = req.body;

  if(password && password.lenght > 3) {
    next();
  } else {
    res.status(422).json({
      message: "Şifre 3 karakterden fazla olmalı",
    })
  }
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.export = {
  sinirli,
  usernameBostami,
  usernameVarmi,
  sifreGecerlimi,
}