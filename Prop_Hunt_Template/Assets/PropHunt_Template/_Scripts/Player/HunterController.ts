import { Camera, Collider, Color, Gizmos, LayerMask, Physics, Time, Transform, Vector3 } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import NonHunterController from './NonHunterController';
import UIManager from '../Managers/UIManager';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import GameManager from '../Managers/GameManager';

export default class HunterController extends ZepetoScriptBehaviour {

    private mainCamera: Camera;
    private timeToCatch: number;
    private remainingTimeToCatch: number;

    private flashLightDetectionZone: Vector3;
    private flashLightRadius: number = 0.5;

    public playerLayer: LayerMask;

    Start() {
        this.mainCamera = ZepetoPlayers.instance.ZepetoCamera.camera;
        this.timeToCatch = GameManager.instance.timeToCatch;
    }

    Update() {
        if (!GameManager.gameStarted) return;

        let position = this.GetForwardPosition(this.transform);
        this.flashLightDetectionZone = position;
        let colls: Collider[] = Physics.OverlapSphere(this.flashLightDetectionZone, this.flashLightRadius, GameManager.instance.playerLayer.value);

        if (colls.length > 0) {
            colls.forEach(coll => {
                let nonHunter = coll.GetComponent<NonHunterController>();
                if (nonHunter == null) return;
                this.TryCatchNonHunter(nonHunter);
            });
        } else {
            this.ResetCatchingState();
        }
    }

    TryCatchNonHunter(nonHunter: NonHunterController) {
        let position = this.mainCamera.WorldToScreenPoint(nonHunter.transform.position);
        UIManager.instance.ShowIconPercentage(true, position);
        this.UpdateCatchPercentage();
        if (this.remainingTimeToCatch < 0) {
            this.CatchNonHunter(nonHunter);
        }
    }

    CatchNonHunter(nonHunter: NonHunterController) {
        nonHunter.gameObject.SetActive(false);
        nonHunter.Spectate(this.transform);
        UIManager.instance.ShowCatchedText();
        GameManager.instance.RestOneNonHunter();
        this.ResetCatchingState();
    }

    UpdateCatchPercentage() {
        this.remainingTimeToCatch -= Time.deltaTime;
        let timePercentage = this.remainingTimeToCatch / this.timeToCatch;
        UIManager.instance.UpdateChargeFillAmount(timePercentage);
    }

    ResetCatchingState() {
        this.remainingTimeToCatch = this.timeToCatch;
        UIManager.instance.ShowIconPercentage(false, Vector3.zero);
    }

    OnDrawGizmos() {
        Gizmos.color = Color.red;
        Gizmos.DrawWireSphere(this.flashLightDetectionZone, this.flashLightRadius);
    }

    GetForwardPosition(tfPos: Transform): Vector3 {
        let finalPos = tfPos.position;
        finalPos.x += tfPos.forward.x;
        finalPos.y += tfPos.forward.y;
        finalPos.z += tfPos.forward.z;
        return finalPos;
    }
}