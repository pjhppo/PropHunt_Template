import { BoxCollider, Camera, GameObject, Input, MeshFilter, Physics, Ray, RaycastHit, Time, Touch, TouchPhase, Vector3 } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Itemtransformable from './Itemtransformable';
import GameManager from '../Managers/GameManager';
import UIManager from '../Managers/UIManager';

export default class NonHunterController extends ZepetoScriptBehaviour {
    private timeToTransform: number;
    private timeRemainingToTransform: number;
    private isTransforming: bool;

    private mainCamera: Camera;
    private player: GameObject;
    private playerParent: GameObject;
    private pointerPos: Vector3;
    private objectTransformed: GameObject;

    Start() {
        if (ZepetoPlayers.instance.LocalPlayer) {
            this.playerParent = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject;
            this.player = this.playerParent.transform.GetChild(0).gameObject;
            this.mainCamera = ZepetoPlayers.instance.ZepetoCamera.camera;
        } else {
            ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
                this.playerParent = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject;
                this.player = this.playerParent.transform.GetChild(0).gameObject;
                this.mainCamera = ZepetoPlayers.instance.ZepetoCamera.camera;
            });

        }

        this.timeToTransform = GameManager.instance.timeToTransform;
        this.ResetTransformationState();
    }

    // Update() {
    //     if (Input.GetMouseButton(0)) {
    //         this.isTransforming = this.RaycastToItem(Input.mousePosition);
    //     }

    //     if (Input.GetMouseButtonUp(0)) {
    //         this.ResetTransformationState();
    //     }

    //     if (Input.touchCount > 0) {
    //         let touch: Touch = Input.GetTouch(0);
    //         let touchPos: Vector3 = new Vector3(touch.position.x, touch.position.y, 0);
    //         this.isTransforming = this.RaycastToItem(touchPos);
    //     }

    //     if (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Ended) {
    //         this.ResetTransformationState();
    //     }

    //     if (this.timeRemainingToTransform < 0) this.RaycastToItem(this.pointerPos, true);

    //     if (this.isTransforming) {
    //         UIManager.instance.ShowIconPercentage(true, this.pointerPos);
    //         this.UpdateTransformPercentage();
    //     } else {
    //         this.ResetTransformationState();
    //     }
    // }

    RaycastToItem(position: Vector3, transformIntoItem: bool = false): bool {
        this.pointerPos = position;
        let item: Itemtransformable;

        if (this.mainCamera == undefined) this.mainCamera = ZepetoPlayers.instance.ZepetoCamera.camera;
        let ray: Ray = this.mainCamera.ScreenPointToRay(position);
        let hit = $ref<RaycastHit>();

        if (Physics.Raycast(ray, hit, 50)) {
            let hitInfo = $unref(hit);
            if (hitInfo.collider.TryGetComponent<Itemtransformable>($ref(item))) {
                if (transformIntoItem) {
                    item = hitInfo.collider.GetComponent<Itemtransformable>();
                    this.TransformIntoItem(item);
                }

                return true;
            }
        }
        return false;
    }

    TransformIntoItem(item: Itemtransformable) {
        this.player.SetActive(false);
        if (this.objectTransformed == null) this.objectTransformed = GameObject.Instantiate(item.modelCollider.gameObject, this.playerParent.transform) as GameObject;
        else {
            this.objectTransformed.GetComponent<MeshFilter>().mesh = item.model.mesh;
            let coll = this.objectTransformed.GetComponent<BoxCollider>();
            coll.size = item.modelCollider.size;
        }

        let objPos: Vector3 = this.playerParent.transform.transform.position;
        // objPos.y += 0.5;

        this.objectTransformed.transform.position = objPos;
        this.ResetTransformationState();
    }

    UpdateTransformPercentage() {
        this.timeRemainingToTransform -= Time.deltaTime;
        let timePercentage = this.timeRemainingToTransform / this.timeToTransform;
        UIManager.instance.UpdateChargeFillAmount(timePercentage);
    }

    ResetTransformationState() {
        this.isTransforming = false;
        this.timeRemainingToTransform = this.timeToTransform;
        UIManager.instance.ShowIconPercentage(false, this.pointerPos);
    }
}