const users = require("../users/users-model");

function sinirli(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({
      message: "Geçemezsiniz!",
    });
  }
}

async function usernameBostami(req, res, next) {
  const [user] = await users.goreBul({ username: req.body.username });

  if (user) {
    res.status(422).json({
      message: "Username kullaniliyor",
    });
  } else {
    next();
  }
}

async function usernameVarmi(req, res, next) {
  const [user] = await users.goreBul({ username: req.body.username });

  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).json({
      message: "Geçersiz kriter",
    });
  }
}

function sifreGecerlimi(req, res, next) {
  const { password } = req.body;

  if (password && password.length > 3) {
    next();
  } else {
    res.status(422).json({
      message: "Şifre 3 karakterden fazla olmalı",
    });
  }
}

module.exports = {
  sinirli,
  usernameBostami,
  usernameVarmi,
  sifreGecerlimi,
};