import { Debug, GameObject, Input, KeyCode, LayerMask, Transform } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import NonHunterController from '../Player/NonHunterController';
import { Time } from 'UnityEngine';
import UIManager from './UIManager';
import MultiplayManager from '../../../Zepeto Multiplay Component/ZepetoScript/Common/MultiplayManager';

export default class GameManager extends ZepetoScriptBehaviour {
    public static instance: GameManager;

    public static gameStarted: bool = false;

    public spawnPoint: Transform;

    public timePerGame: number;
    private timeRemaining: number;

    private nonHuntersLeft: number;

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
        /*this.StartGame();*/
    }

    Update() {
        if (!GameManager.gameStarted) return;

        this.CheckRemainingTime();
    }

    StartGame() {
        this.timeRemaining = this.timePerGame;
        GameManager.gameStarted = true;

        // FOR TEST
        UIManager.instance.teamSelectorObj.SetActive(false);
    }

    StopGame() {
        GameManager.gameStarted = false;
    }

    AddOneNonHunter() {
        this.nonHuntersLeft++;
    }

    RestOneNonHunter() {
        this.nonHuntersLeft--;
        this.CheckRemainingNonHunters();
    }

    CheckRemainingNonHunters() {
        if (this.nonHuntersLeft > 0) return;
        this.SelectTeamWins(true);
    }

    CheckRemainingTime() {
        this.timeRemaining -= Time.deltaTime;
        UIManager.instance.UpdateTimeRemaining(this.timeRemaining);
        if (this.timeRemaining <= 0) {
            this.SelectTeamWins(false);
        }
    }

    SelectTeamWins(hunterWins: bool) {
        if (hunterWins) {

        } else {

        }
    }
}