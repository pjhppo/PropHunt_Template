import { BoxCollider, GameObject, Mathf, MeshFilter, MeshRenderer, Quaternion, Transform, Vector3 } from 'UnityEngine';
import { ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Itemtransformable from './Itemtransformable';
import UIManager from '../Managers/UIManager';
import GameManager from '../Managers/GameManager';
import PlayerModel from '../Multiplayer/PlayerModel';
import MultiplayManager from '../../../Zepeto Multiplay Component/ZepetoScript/Common/MultiplayManager';

export default class NonHunterController extends ZepetoScriptBehaviour {
    private playerParent: GameObject;
    private playerChild: Transform;
    private objectTransformed: GameObject;

    Start() {
        this.playerParent = this.gameObject;
        this.playerChild = this.playerParent.transform.GetChild(0);

        let player =ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject;

        if (player == this.playerParent){
            UIManager.instance.sliderRot.onValueChanged.AddListener((value) => {
                this.RotateItem(value);
            });
        }

        GameManager.instance.AddOneNonHunter();
    }

    TransformIntoItem(itemObj: GameObject) {
        for (let index = 0; index < this.playerChild.childCount; index++) {
            this.playerChild.GetChild(index).gameObject.SetActive(false);
        }
        for (let index = 1; index < this.playerParent.transform.childCount; index++) {
            this.playerParent.transform.GetChild(index).gameObject.SetActive(false);
        }

        if (itemObj) {
            itemObj.transform.SetParent(this.playerParent.transform);

            this.objectTransformed = itemObj;
            let coll = this.objectTransformed.GetComponent<BoxCollider>();
            coll.size = itemObj.GetComponent<BoxCollider>().size;
        }

        let objPos: Vector3 = this.playerParent.transform.transform.position;

        this.objectTransformed.transform.position = objPos;
    }

    TransformIntoPlayer() {
        for (let index = 0; index < this.playerChild.childCount; index++) {
            this.playerChild.GetChild(index).gameObject.SetActive(true);
        }

        for (let index = 1; index < this.playerParent.transform.childCount; index++) {
            this.playerParent.transform.GetChild(index).gameObject.SetActive(false);
        }
    }

    RotateItem(percentage: number) {
        if (this.objectTransformed != null) {
            let rotation: Vector3 = new Vector3(0, Mathf.Lerp(0, 360, percentage), 0);
            this.playerParent.transform.rotation = Quaternion.Euler(rotation);
        }
    }

    Spectate(spectatePlayer: Transform){
        ZepetoPlayers.instance.LocalPlayer.zepetoCamera.SetFollowTarget(spectatePlayer);
    }

    ResetNonHunter(){
        this.TransformIntoPlayer();
        ZepetoPlayers.instance.LocalPlayer.zepetoCamera.SetFollowTarget(this.playerParent.transform);
    }
}