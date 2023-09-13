import { Debug, GameObject, Input, KeyCode, LayerMask, Transform } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import NonHunterController from '../Player/NonHunterController';
import { Time } from 'UnityEngine';
import UIManager from './UIManager';
import MultiplayerPropHuntManager, { PlayerDataModel } from '../Multiplayer/MultiplayerPropHuntManager';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import HunterController from '../Player/HunterController';
import TransformableItemsManager from './TransformableItemsManager';

export default class GameManager extends ZepetoScriptBehaviour {
    public static instance: GameManager;

    public static gameStarted: bool = false;
    public gameState: GameState;

    public spawnPoint: Transform;

    public timePerGame: number;
    public timeRemaining: number;

    public timeToHide: number;

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
        this.SetGameState(GameState.CHOOSING_TEAM);
    }

    Update() {
        if (!GameManager.gameStarted) return;
        this.CheckRemainingTime();
    }

    public SetGameState(gameState: GameState) {
        this.gameState = gameState;

        switch (gameState) {
            case GameState.CHOOSING_TEAM:
                break;
            case GameState.PROPS_HIDING:
                break;
            case GameState.HUNTERS_SEARCHING:
                break;
            case GameState.GAME_FINISH:
                break;
        }
    }

    StartGame() {
        MultiplayerPropHuntManager.instance.playersData.forEach((player) => {
            const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(player.sessionId).character.gameObject;

            if (player.isHunter) {
                zepetoPlayer.AddComponent<HunterController>();
            }
            else {
                zepetoPlayer.AddComponent<NonHunterController>();
            }
        });

        this.ShowBlackoutOnHunters(true);

        this.timeRemaining = this.timeToHide;
        GameManager.gameStarted = true;
        this.SetGameState(GameState.PROPS_HIDING);

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

            if (this.gameState == GameState.PROPS_HIDING) {
                this.ShowBlackoutOnHunters(false);
                this.SetGameState(GameState.HUNTERS_SEARCHING);

                this.timeRemaining = this.timePerGame;
            }
            else if (this.gameState == GameState.HUNTERS_SEARCHING) {
                this.SelectTeamWins(true);
            }
        }
    }

    ShowBlackoutOnHunters(value: boolean) {
        /*
        let playerData = MultiplayerPropHuntManager.instance.GetPlayerData(MultiplayerPropHuntManager.instance.GetLocalSessionId());

        if (playerData.isHunter) {

        }
        */

        UIManager.instance.ShowBlackoutScreen(value);
    }

    SelectTeamWins(huntersWins: boolean) {
        MultiplayerPropHuntManager.instance.SwitchReady();
        this.StopGame();

        this.gameState = GameState.GAME_FINISH;

        UIManager.instance.ShowWinScreen(huntersWins);
    }

    ResetGame() {
        MultiplayerPropHuntManager.instance.ChangeItem("");

        MultiplayerPropHuntManager.instance.playersData.forEach((player) => {
            const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(player.sessionId);
            let gameScript;

            gameScript = zepetoPlayer.character.GetComponent<NonHunterController>();
            if (gameScript) {
                GameObject.Destroy(gameScript);
            } else {
                gameScript = zepetoPlayer.character.GetComponent<HunterController>();
                if (gameScript) GameObject.Destroy(gameScript);
            }

            zepetoPlayer.character.Teleport(this.spawnPoint.position, this.spawnPoint.rotation);
        });


        UIManager.instance.teamSelectorObj.SetActive(true);
    }
}

enum GameState {
    CHOOSING_TEAM,
    PROPS_HIDING,
    HUNTERS_SEARCHING,
    GAME_FINISH
}