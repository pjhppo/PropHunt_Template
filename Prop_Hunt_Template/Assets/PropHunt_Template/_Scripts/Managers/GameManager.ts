import { GameObject, LayerMask } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import NonHunterController from '../Player/NonHunterController';

export default class GameManager extends ZepetoScriptBehaviour {
    public static instance: GameManager;


    @Header("NonHunter")
    public timeToTransform: number;
    public nonHunterScript: NonHunterController;

    @Header("Hunter")
    public timeToCatch: number;
    public playerLayer: LayerMask;

    Awake() {
        if (GameManager.instance != null) GameObject.Destroy(this.gameObject);
        else GameManager.instance = this;
    }

    Start() {

    }

}