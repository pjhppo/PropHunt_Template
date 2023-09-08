import { GameObject } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import HunterController from './HunterController';
import NonHunterController from './NonHunterController';
import GameManager from '../Managers/GameManager';

export default class PlayerController extends ZepetoScriptBehaviour {

    private playerGo: GameObject;

    /*

    Start() {
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.playerGo = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject;
        });
    }

    SelectTeam(isHunter: bool) {
        if (isHunter) {
            this.playerGo.AddComponent<HunterController>();
        } else {
            let nonHunterScript: NonHunterController = this.playerGo.AddComponent<NonHunterController>();
            GameManager.instance.nonHunterScript = nonHunterScript;
        }
    }
    */
}