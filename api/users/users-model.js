const db = require("../../data/db-config");


/**
  tüm kullanıcıları içeren bir DİZİ ye çözümlenir, tüm kullanıcılar { user_id, username } içerir
 */
function bul() {
  return db("users").select("user_id","username");
}

/**
  verilen filtreye sahip tüm kullanıcıları içeren bir DİZİ ye çözümlenir
 */
function goreBul(filtre) {
  return db("users")
  .where(filtre)
  .select("user_id","username")
}

/**
  verilen user_id li kullanıcıya çözümlenir, kullanıcı { user_id, username } içerir
 */
function idyeGoreBul(user_id) {
  return db("users")
    .first()
    .where({user_id}).select("user_id", "username")
}

/**
  yeni eklenen kullanıcıya çözümlenir { user_id, username }
 */
function ekle(user) {
  const [user_id] = await db("users").insert(user);
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.exports = {
  bul,
  goreBul,
  idyeGoreBul,
  ekle,
}