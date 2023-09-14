import { GameObject, LayerMask, Transform } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import NonHunterController from '../Player/NonHunterController';
import { Time } from 'UnityEngine';
import UIManager from './UIManager';
import MultiplayerPropHuntManager, { PlayerDataModel } from '../Multiplayer/MultiplayerPropHuntManager';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import HunterController from '../Player/HunterController';
import { UnityEvent } from 'UnityEngine.Events';

// This class manages the calls and connections between different scripts and the basic operation of the game
export default class GameManager extends ZepetoScriptBehaviour {
    // Is used for the singleton pattern
    public static instance: GameManager;

    @HideInInspector() public OnReset: UnityEvent = new UnityEvent();

    public static gameStarted: bool = false; // Controls if the game has started
    public gameState: GameState; // Contains the actual state of the game0

    public spawnPoint: Transform; // Sets the spawnPoints for the players

    public timePerGame: number; // Sets the duration of each game
    @SerializeField() public timeRemainingToHide: number; // Contains the remaining time to hide before the game start 

    public timeToHide: number; // Sets the duration of the time to hide

    private nonHuntersLeft: number; // Contains the amount of props not catched

    @Header("Hunter")
    public timeToCatch: number; // Sets the catch time for the hunter
    public playerLayer: LayerMask; // Sets the layer that the hunter detects to catch the props

    Awake() {
        // Singleton pattern
        if (GameManager.instance != null) GameObject.Destroy(this.gameObject);
        else GameManager.instance = this;
    }

    Start() {
        // Call to the function SetGameState
        this.SetGameState(GameState.CHOOSING_TEAM);
    }

    Update() {
        // Check if the game has started and returns if not
        if (!GameManager.gameStarted) return;
        // Call to the function that controls the remaining time CheckRemainingTime
        this.CheckRemainingTime();
    }

    // This function
    public SetGameState(gameState: GameState) {
        this.gameState = gameState;

        switch (gameState) {
            case GameState.CHOOSING_TEAM:
                GameManager.gameStarted = false;
                break;
            case GameState.PROPS_HIDING:
                GameManager.gameStarted = true;
                this.timeRemainingToHide = this.timeToHide;
                break;
            case GameState.HUNTERS_SEARCHING:
                this.timeRemainingToHide = this.timePerGame;
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

        this.timeRemainingToHide = this.timeToHide;
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
        this.timeRemainingToHide -= Time.deltaTime;
        UIManager.instance.UpdateTimeRemaining(this.timeRemainingToHide);
        if (this.timeRemainingToHide <= 0) {

            if (this.gameState == GameState.PROPS_HIDING) {
                this.ShowBlackoutOnHunters(false);
                this.SetGameState(GameState.HUNTERS_SEARCHING);
            }
            else if (this.gameState == GameState.HUNTERS_SEARCHING) {
                this.SelectTeamWins(false);
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
        MultiplayerPropHuntManager.instance.playersData.forEach((player) => {
            const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(player.sessionId);
            let isLocal = zepetoPlayer == ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;
            let gameScript;

            gameScript = zepetoPlayer.character.GetComponent<NonHunterController>();
            if (gameScript) {
                gameScript.ResetNonHunter(isLocal);
                GameObject.Destroy(gameScript);
            } else {
                gameScript = zepetoPlayer.character.GetComponent<HunterController>();
                if (gameScript) GameObject.Destroy(gameScript);
            }

            zepetoPlayer.character.Teleport(this.spawnPoint.position, this.spawnPoint.rotation);
        });

        UIManager.instance.teamSelectorObj.SetActive(true);

        this.SetGameState(GameState.CHOOSING_TEAM);
        if(this.OnReset != null)
            this.OnReset.Invoke();
    }
}

enum GameState {
    CHOOSING_TEAM,
    PROPS_HIDING,
    HUNTERS_SEARCHING,
    GAME_FINISH
}