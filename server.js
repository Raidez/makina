const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("../../makina/db.json");
const db = low(adapter);

db.defaults({ players: [] }).write();

// lors de la connexion d'un joueur
on("playerConnecting", (playerName) => {
  const player = db.get("players").find({ name: playerName }).value();
  console.log(player);
  if (!player) {
    /// ajout du nouveau joueur dans la base
    db.get("players")
      .push({
        name: playerName,
        experience: 0,
      })
      .write();
  } else {
    /// récupération des informations du joueur
    exports.XNLRankBar.Exp_XNL_SetInitialXPLevels(player.experience, true, false);
  }
});
