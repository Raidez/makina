// const fs = require('fs');
// import * as fs from 'fs';

const spawnPos = [184.19, -679.56, 43.14]; //heading : 344.97
const vehiculesLvl1 = ["panto", "brioso", "asea2"];
const vehiculesLvl2 = ["bestiagts", "surano", "alpha"];
const vehiculesLvl3 = ["autarch", "fmj", "zentorno"];

on('onClientGameTypeStart', () => {
    exports.spawnmanager.setAutoSpawnCallback(() => {
        exports.spawnmanager.spawnPlayer({
            x: spawnPos[0],
            y: spawnPos[1],
            z: spawnPos[2],
            model: 'a_m_m_skater_01'
        }, () => {
            emit('chat:addMessage', {
                args: [
                    'Bienvenue !'
                ]
            })
        });
    });

    exports.spawnmanager.setAutoSpawn(true)
    exports.spawnmanager.forceRespawn()
});


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function LoadModel(hash) {
    RequestModel(hash);
    while (!HasModelLoaded(hash)) {
        await sleep(500)
    }
}

async function SpawnVehicle(model, ped, spawnInside) {
    const hash = GetHashKey(model);
    if (!IsModelInCdimage(hash) || !IsModelAVehicle(hash)) return;

    await LoadModel(hash);

    const coords = GetEntityCoords(ped);
    const heading = GetEntityHeading(ped);
    const vehicle = CreateVehicle(hash, coords[0], coords[1], coords[2], heading, true, false);
    if (spawnInside) SetPedIntoVehicle(ped, vehicle, -1);

    SetEntityAsNoLongerNeeded(vehicle);
    SetModelAsNoLongerNeeded(model);
}

// https://forum.cfx.re/t/release-xnlrankbar-fully-working-original-gta-rankbar-xp-bar-natively-with-original-gta-levels/318839
RegisterCommand("rank", async (source, args, raw) => {
    if (args.length == 0) {
        const currentExp = exports.XNLRankBar.Exp_XNL_GetCurrentPlayerXP();
        const currentLevel = exports.XNLRankBar.Exp_XNL_GetCurrentPlayerLevel();
        console.log(`Tu es niveau ${currentLevel} (${currentExp} EXP)`);
    } else {
        const action = args[0];
        const amount = parseInt(args[1]);
        switch (action) {
            case "set":
                exports.XNLRankBar.Exp_XNL_SetInitialXPLevels(amount, true, true);
                console.log(`Ton niveau a été mis à jour à ${amount} !`)
                break;
            case "add":
                exports.XNLRankBar.Exp_XNL_AddPlayerXP(amount);
                console.log(`Tu as gagné ${args[1]} points d'expérience !`)
                break;
            case "sub":
                exports.XNLRankBar.Exp_XNL_RemovePlayerXP(amount);
                console.log(`Tu as perdu ${args[1]} points d'expérience !`);
                break;
        }
    }
}, false);

RegisterCommand('car', async (source, args, raw) => {
    let model = "adder";
    if (args.length > 0) {
        model = args[0].toString();
    }

    const ped = PlayerPedId();

    const currentLevel = exports.XNLRankBar.Exp_XNL_GetCurrentPlayerLevel();
    if (vehiculesLvl1.includes(model) && currentLevel >= 1) {
        await SpawnVehicle(model, ped, true);
    } else if (vehiculesLvl2.includes(model) && currentLevel >= 2) {
        await SpawnVehicle(model, ped, true);
    } else if (vehiculesLvl3.includes(model) && currentLevel >= 3) {
        await SpawnVehicle(model, ped, true);
    } else {
        console.error("Tu n'as pas le niveau requis !")
    }
}, false);
