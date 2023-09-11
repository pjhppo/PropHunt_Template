import { Debug, GameObject, Input, KeyCode, LayerMask, Transform } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import NonHunterController from '../Player/NonHunterController';
import { Time } from 'UnityEngine';
import UIManager from './UIManager';
import MultiplayerPropHuntManager, {PlayerDataModel} from '../Multiplayer/MultiplayerPropHuntManager';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import HunterController from '../Player/HunterController';

export default class GameManager extends ZepetoScriptBehaviour {
    public static instance: GameManager;

    public static gameStarted: bool = false;
    public gameState : GameState;

    public spawnPoint: Transform;

    public timePerGame: number;
    private timeRemaining: number;

    public timeToHide: number;

    private nonHuntersLeft: number;

    @Header("NonHunter")
    public timeToTransform: number;
    public nonHunterScript: NonHunterController;

    @Header("Hunter")
    public timeToCatch: number;
    public playerLayer: LayerMask;
    private _allPlayers: Map<string, PlayerDataModel> = new Map<string, PlayerDataModel>();

    Awake() {
        if (GameManager.instance != null) GameObject.Destroy(this.gameObject);
        else GameManager.instance = this;

    }

    Start() {
      this.gameState = GameState.CHOOSING_TEAM;
    }

    Update() {
        if (!GameManager.gameStarted) return;

        this.CheckRemainingTime();
    }

    public AddPlayer(sessionId: string, dataModel: PlayerDataModel)
    {
        if(!this._allPlayers.has(sessionId)){
            this._allPlayers.set(sessionId, dataModel)
        }
    }

    public UpdatePlayerData(dataModel: PlayerDataModel){
        if(this._allPlayers.has(dataModel.sessionId)){
            this._allPlayers.set(dataModel.sessionId, dataModel)
        }
    }

    public GetPlayer(sessionId: string) : PlayerDataModel{
        let playerDataModel : PlayerDataModel = null;
        
        if(this._allPlayers.has(sessionId)){
            playerDataModel = this._allPlayers.get(sessionId);
        }

        return playerDataModel;
    }

    StartGame() 
    {
        this._allPlayers.forEach((player) =>{
            const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(player.sessionId).character.gameObject;
                
            if (player.isHunter){
                zepetoPlayer.AddComponent<HunterController>();
            }
            else{
                zepetoPlayer.AddComponent<NonHunterController>();
            }
        });

        this.ShowBlackoutOnHunters(true);

        this.timeRemaining = this.timeToHide;
        GameManager.gameStarted = true;
        this.gameState = GameState.PROPS_HIDING;

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

            if(this.gameState == GameState.PROPS_HIDING){
                this.ShowBlackoutOnHunters(false);
                this.gameState = GameState.HUNTERS_SEARCHING;
                this.timeRemaining = this.timePerGame;
            }
            else if(this.gameState == GameState.HUNTERS_SEARCHING){
                this.SelectTeamWins(false);
                this.gameState = GameState.GAME_FINISH;
            }
        }
    }

    ShowBlackoutOnHunters(value : boolean)
    {
        let playerData = this.GetPlayer(MultiplayerPropHuntManager.instance.GetLocalSessionId());
        
        if(playerData.isHunter)
        {
            UIManager.instance.ShowBlackoutScreen(value);
        }
    }

    SelectTeamWins(hunterWins: bool) {
        if (hunterWins) {

        } else {

        }
    }


}

enum GameState{
    CHOOSING_TEAM,
    PROPS_HIDING,
    HUNTERS_SEARCHING,
    GAME_FINISH
}