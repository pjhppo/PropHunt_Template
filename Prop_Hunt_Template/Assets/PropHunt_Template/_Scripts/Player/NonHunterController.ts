import { BoxCollider, GameObject, Mathf, MeshFilter, MeshRenderer, Quaternion, Vector3 } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Itemtransformable from './Itemtransformable';
import UIManager from '../Managers/UIManager';
import GameManager from '../Managers/GameManager';

export default class NonHunterController extends ZepetoScriptBehaviour {
    private player: GameObject;
    private playerParent: GameObject;
    private objectTransformed: GameObject;

    Start() {
        if (ZepetoPlayers.instance.LocalPlayer) {
            this.playerParent = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject;
            this.player = this.playerParent.transform.GetChild(0).gameObject;
        } else {
            ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
                this.playerParent = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject;
                this.player = this.playerParent.transform.GetChild(0).gameObject;
            });
        }

        UIManager.instance.sliderRot.onValueChanged.AddListener((value) => {
            this.RotateItem(value);
        });

        UIManager.instance.ShowNonHunterUI();
        GameManager.instance.AddOneNonHunter();
    }

    TransformIntoItem(item: Itemtransformable) {
        this.player.SetActive(false);
        if (this.objectTransformed == null) this.objectTransformed = GameObject.Instantiate(item.itemPrefab, this.playerParent.transform) as GameObject;
        else {
            this.objectTransformed.GetComponent<MeshFilter>().mesh = item.GetModel().mesh;
            this.objectTransformed.GetComponent<MeshRenderer>().material = item.GetModelMaterial();
            let coll = this.objectTransformed.GetComponent<BoxCollider>();
            coll.size = item.GetModelCollider().size;
        }

        let objPos: Vector3 = this.playerParent.transform.transform.position;

        this.objectTransformed.transform.position = objPos;
    }

    RotateItem(percentage: number) {
        let rotation: Vector3 = new Vector3(0, Mathf.Lerp(0, 360, percentage), 0);
        this.objectTransformed.transform.rotation = Quaternion.Euler(rotation);
    }
}