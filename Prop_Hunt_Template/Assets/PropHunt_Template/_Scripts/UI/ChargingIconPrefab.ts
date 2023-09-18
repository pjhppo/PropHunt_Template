import { GameObject } from 'UnityEngine';
import { Image } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

// This class contains an icon gameobject with the image to edit it
export default class ChargingIconPrefab extends ZepetoScriptBehaviour {
    public icon: GameObject; // Reference to the game object
    public iconCharge: Image; // Reference to the image
}