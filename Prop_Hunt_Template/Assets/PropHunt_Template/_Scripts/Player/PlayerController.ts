import { GameObject } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import HunterController from './HunterController';
import NonHunterController from './NonHunterController';
import UIManager from '../Managers/UIManager';
import ChargingIconPrefab from '../UI/ChargingIconPrefab';

export default class PlayerController extends ZepetoScriptBehaviour {

    private playerGo: GameObject;


    Start() {
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.playerGo = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject;
            // let chargingCanvas: GameObject = GameObject.Instantiate(UIManager.instance.iconImagePrefab) as GameObject;
            // let chargingScript: ChargingIconPrefab = chargingCanvas.GetComponent<ChargingIconPrefab>();
            // UIManager.instance.icon = chargingScript.icon;
            // UIManager.instance.iconCharge = chargingScript.iconCharge;
            this.SelectTeam(true);
        });
    }

    SelectTeam(isHunter: bool) {
        if (isHunter) {
            this.playerGo.AddComponent<HunterController>();
        } else {
            this.playerGo.AddComponent<NonHunterController>();
        }
    }
}