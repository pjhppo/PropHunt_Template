import { BoxCollider, GameObject, Input, KeyCode, Mathf, MeshFilter, MeshRenderer, Quaternion, Transform, Vector3 } from 'UnityEngine';
import { ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Itemtransformable from './Itemtransformable';
import UIManager from '../Managers/UIManager';
import GameManager from '../Managers/GameManager';
import PlayerModel from '../Multiplayer/PlayerModel';
import MultiplayManager from '../../../Zepeto Multiplay Component/ZepetoScript/Common/MultiplayManager';
import { PlayerDataModel } from '../Multiplayer/MultiplayerPropHuntManager';

export default class NonHunterController extends ZepetoScriptBehaviour {
    private playerParent: GameObject;
    private playerChild: Transform;
    private objectTransformed: GameObject;

    private spectingNumber: number = 0;
    private playerList: PlayerDataModel[] = [];
    Start() {
        this.playerParent = this.gameObject;
        this.playerChild = this.playerParent.transform.GetChild(0);

        let player = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject;

        if (player == this.playerParent) {
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

    // Update() {
    //     if (Input.GetKeyDown(KeyCode.Q)) this.NextSpectatorCamera();
    //     if (Input.GetKeyDown(KeyCode.E)) this.PreviousSpectatorCamera();
    // }
    
    Spectate(spectatePlayer: Transform) {
        UIManager.instance.SwitchSpectateScreen();
        ZepetoPlayers.instance.LocalPlayer.zepetoCamera.SetFollowTarget(spectatePlayer);
    }

    NextSpectatorCamera() {
        if (!(this.playerList.length > 0)) this.playerList = this.GetPlayerList();

        if (this.playerList.length > 1) {
            this.spectingNumber++;
            this.LimitSpectingNumber(this.playerList.length);

            let playerToSpect = ZepetoPlayers.instance.GetPlayer(this.playerList[this.spectingNumber].sessionId).character.transform;
            this.Spectate(playerToSpect);
        }
    }

    PreviousSpectatorCamera() {
        if (!(this.playerList.length > 0)) this.playerList = this.GetPlayerList();

        if (this.playerList.length > 1) {
            this.spectingNumber--;
            this.LimitSpectingNumber(this.playerList.length);

            let playerToSpect = ZepetoPlayers.instance.GetPlayer(this.playerList[this.spectingNumber].sessionId).character.transform;
            this.Spectate(playerToSpect);
        }
    }

    private GetPlayerList(): PlayerDataModel[] {
        let playerList: PlayerDataModel[] = [];
        GameManager.instance.AllPlayers.forEach((value, key) => {
            if (!value.isHunter) playerList.push(value);
        });
        return playerList;
    }

    private LimitSpectingNumber(limit: number) {
        if (this.spectingNumber >= limit) this.spectingNumber = 0;
        if (this.spectingNumber < 0) this.spectingNumber = limit - 1;
    }

    ResetNonHunter() {
        this.TransformIntoPlayer();
        ZepetoPlayers.instance.LocalPlayer.zepetoCamera.SetFollowTarget(this.playerParent.transform);
    }
}