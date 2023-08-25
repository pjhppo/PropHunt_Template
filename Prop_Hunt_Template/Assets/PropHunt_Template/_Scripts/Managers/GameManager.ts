import { GameObject, LayerMask } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class GameManager extends ZepetoScriptBehaviour {
    public static instance: GameManager;

    @Header("NonHunter")
    public timeToTransform: number;
    
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