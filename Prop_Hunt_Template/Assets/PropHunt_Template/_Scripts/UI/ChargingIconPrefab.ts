import { GameObject } from 'UnityEngine';
import { Image } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class ChargingIconPrefab extends ZepetoScriptBehaviour {
    public icon: GameObject;
    public iconCharge: Image;
}