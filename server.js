const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("../../makina/db.json");
const db = low(adapter);

db.defaults({ players: [] }).write();

// lors de la connexion d'un joueur
on("playerConnecting", (playerName, setKickReason, deferrals, netId) => {
  const player = db.get("players").find({ name: playerName }).value();
  console.log("CONNECT", player, netId);
  if (!player) {
    /// ajout du nouveau joueur dans la base
    console.log("création du nouveau joueur");
    db.get("players")
      .push({
        name: playerName,
        experience: 0,
        lastNetId: netId,
      })
      .write();
  } else {
    /// mettre à jour le net ID du joueur dans la BDD
    console.log("ajout du netId");
    db.get("players").find({ name: playerName }).assign({ lastNetId: netId }).write();
  }
});

on("playerJoining", (netId) => {
  const player = db.get("players").find({ lastNetId: netId }).value();
  console.log("JOIN", player);
  if (player) {
    /// récupération des informations du joueur
    emitNet("updateEXP", playerName, player.experience);
  }
});
