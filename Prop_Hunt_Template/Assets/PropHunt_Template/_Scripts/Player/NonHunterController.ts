import { BoxCollider, GameObject, Mathf, MeshFilter, MeshRenderer, Quaternion, Transform, Vector3 } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
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

        UIManager.instance.sliderRot.onValueChanged.AddListener((value) => {
            this.RotateItem(value);
        });

        GameManager.instance.AddOneNonHunter();
    }

    TransformIntoItem(itemObj: GameObject, item?: Itemtransformable) {
        for (let index = 0; index < this.playerChild.childCount; index++) {
            this.playerChild.GetChild(index).gameObject.SetActive(false);
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

    RotateItem(percentage: number) {
        if(this.objectTransformed != null){
            let rotation: Vector3 = new Vector3(0, Mathf.Lerp(0, 360, percentage), 0);
            this.playerParent.transform.rotation = Quaternion.Euler(rotation);
        }

    }
}