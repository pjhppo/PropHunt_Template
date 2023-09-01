import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import { LocalPlayer, SpawnInfo, UIZepetoPlayerControl, ZepetoCamera, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { WorldService } from 'ZEPETO.World';
import { GameObject } from 'UnityEngine';
import GameManager from '../Managers/GameManager';

// This script spawns a single player
export default class PlayerSpawner extends ZepetoScriptBehaviour {
    Start() {
        let spawn: SpawnInfo = new SpawnInfo();
        spawn.position = GameManager.instance.spawnPoint.position;

        // Grab the user id specified from logging into zepeto through the editor. 
        ZepetoPlayers.instance.CreatePlayerWithUserId(WorldService.userId, spawn, true);

        ZepetoPlayers.instance.OnAddedPlayer.AddListener((userId) => {
            let player = ZepetoPlayers.instance.GetPlayer(userId);
            player.character.gameObject.name = userId;
        });
    }

}