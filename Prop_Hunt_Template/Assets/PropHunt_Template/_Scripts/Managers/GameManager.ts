import { GameObject, LayerMask, Quaternion, Transform } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import NonHunterController from '../Player/NonHunterController';
import { Time } from 'UnityEngine';
import UIManager from './UIManager';
import MultiplayerPropHuntManager from '../Multiplayer/MultiplayerPropHuntManager';
import { UIZepetoPlayerControl, ZepetoPlayerControl, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import HunterController from '../Player/HunterController';
import { UnityEvent } from 'UnityEngine.Events';
import RandomSpawner from './RandomSpawner';

// This class manages the calls and connections between different scripts and the basic operation of the game
export default class GameManager extends ZepetoScriptBehaviour {
    public static instance: GameManager; // Is used for the singleton pattern

    @HideInInspector() public OnReset: UnityEvent = new UnityEvent();

    public static gameStarted: bool = false; // Controls if the game has started
    public gameState: GameState; // Contains the actual state of the game0

    public timePerGame: number; // Sets the duration of each game
    @NonSerialized() public timeRemaining: number; // Contains the remaining time to hide before the game start 

    public timeToHide: number; // Sets the duration of the time to hide

    private nonHuntersLeft: number = 0; // Contains the amount of props not catched

    @Header("Hunter")
    public timeToCatch: number; // Sets the catch time for the hunter
    public playerLayer: LayerMask; // Sets the layer that the hunter detects to catch the props

    private zepetoControl: UIZepetoPlayerControl;
    Awake() {
        // Singleton pattern
        if (GameManager.instance != null) GameObject.Destroy(this.gameObject);
        else GameManager.instance = this;
    }

    Start() {
        // Call to the function SetGameState
        this.SetGameState(GameState.CHOOSING_TEAM);

        // When add the local player
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            // Get the reference of the zepeto ui control
            this.zepetoControl = GameObject.FindObjectOfType<UIZepetoPlayerControl>();
            // Deactivate the UI for control
            this.ActiveControls(false);
        });
    }

    Update() {
        // Check if the game has started and returns if not
        if (!GameManager.gameStarted) return;
        // Call to the function that controls the remaining time CheckRemainingTime
        this.CheckRemainingTime();
    }

    // This function sets the game state by the parameter
    public SetGameState(gameState: GameState) {
        // Set the variable to the value passed as parameter
        this.gameState = gameState;

        // The switch into the diferent enum values
        switch (gameState) {
            // If Choosing team
            case GameState.CHOOSING_TEAM:
                // Set the gameStarted on false
                GameManager.gameStarted = false;
                break;
            // If starts the props hiding
            case GameState.PROPS_HIDING:
                // Set the gameStarted on true
                GameManager.gameStarted = true;
                // Set the remaining time to the time to hide
                this.timeRemaining = this.timeToHide;
                break;
            // If starts hunters searching
            case GameState.HUNTERS_SEARCHING:
                // Set the remaining time to the time per game
                this.timeRemaining = this.timePerGame;
                break;
            // If starts the game finish 
            case GameState.GAME_FINISH:
                break;
        }
    }

    // This function set all the start of the game
    StartGame() {
        // For each player in playerData of MultiplayerPropHuntManager
        MultiplayerPropHuntManager.instance.playersData.forEach((player) => {
            // Get a zepetoPlayer by the player.sessionId
            const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(player.sessionId).character.gameObject;

            // Check if the player is hunter
            if (player.isHunter) {
                // Add the component of the hunter
                zepetoPlayer.AddComponent<HunterController>();
            }
            else {
                // Add the component of the nonHunter/prop
                zepetoPlayer.AddComponent<NonHunterController>();
            }
        });

        // Call to the function ShowBlackoutOnHunters
        this.ShowBlackoutOnHunters(true);

        // Set the time remaining to the time to hide
        this.timeRemaining = this.timeToHide;
        // Set the gameStarted to true
        GameManager.gameStarted = true;
        // Call to the function to set the game state to props hiding
        this.SetGameState(GameState.PROPS_HIDING);

        // Unactive the team selector on the UIManager
        UIManager.instance.teamSelectorObj.SetActive(false);

        // Activate the control ui
        this.ActiveControls(true);
    }

    // This function change the gameStarted to false
    StopGame() {
        GameManager.gameStarted = false;
    }

    // This function activate the ui for movement of zepeto by the parameter
    ActiveControls(active: bool) {
        // Activate the object depending on the parameter
        this.zepetoControl.gameObject.SetActive(active);
    }

    // This function add a non hunter to the team
    AddOneNonHunter() {
        this.nonHuntersLeft++;

        // Call to update the props counter
        UIManager.instance.UpdatePropsCounter(this.nonHuntersLeft);
    }

    // This function rest a non hunter to the team
    RestOneNonHunter() {
        this.nonHuntersLeft--;

        // Call to the function to check the number of non hunters
        this.CheckRemainingNonHunters();

        // Call to update the props counter
        UIManager.instance.UpdatePropsCounter(this.nonHuntersLeft);
    }

    // This function checks if there are nonHunters not catched
    CheckRemainingNonHunters() {
        // Check if there are non hunters if it is return
        if (this.nonHuntersLeft > 0 || !GameManager.gameStarted) return;
        // If there aren't call to the function to select the team winner
        this.SelectTeamWins(true);
    }

    // This function checks the remaining time
    CheckRemainingTime() {
        // Reduce the remaining time in real time
        this.timeRemaining -= Time.deltaTime;
        // Call to the function to show the time on the UIManager
        UIManager.instance.UpdateTimeRemaining(this.timeRemaining);
        // Check if the remaining time is less or equal to 0
        if (this.timeRemaining <= 0) {
            // Check if we are in the hiding state
            if (this.gameState == GameState.PROPS_HIDING) {
                // Call to the function to hide the blackout on hunters
                this.ShowBlackoutOnHunters(false);
                // Call to the function to set the game state on searching
                this.SetGameState(GameState.HUNTERS_SEARCHING);
            }
            // check if we are in the Searching state
            else if (this.gameState == GameState.HUNTERS_SEARCHING) {
                // Call to the function to set the winner
                this.SelectTeamWins(false);
            }
        }
    }

    // This function actives the blackout screen on the hunters
    ShowBlackoutOnHunters(value: boolean) {
        // Call to the function that shows the blackout screen passing a parameter to active or not
        UIManager.instance.ShowBlackoutScreen(value);
    }

    // This function select wich team is the winner
    SelectTeamWins(huntersWins: boolean) {
        if (!GameManager.gameStarted) return;
        
        // Call to the function to set the player ready state
        MultiplayerPropHuntManager.instance.SwitchReady();
        // Call to the function to stop the game
        this.StopGame();

        // Call to the function to set the game state on finish
        this.SetGameState(GameState.GAME_FINISH);

        // Call to the function to show the winner screen on the UIManager
        UIManager.instance.ShowWinScreen(huntersWins);
    }

    // This function resets the game to be ready to start another one
    ResetGame() {
        // For each player on the game
        MultiplayerPropHuntManager.instance.playersData.forEach((player) => {
            // Get a reference of the player with the sessionId
            const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(player.sessionId);
            // Save a variable to know if the player is the local player
            let isLocal = zepetoPlayer == ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;
            // Create a variable to reset the script of the player
            let gameScript;

            // Get a reference of the NonHunterController if the player has one
            gameScript = zepetoPlayer.character.GetComponent<NonHunterController>();
            // If gameScript is not null
            if (gameScript) {
                // Call to the function in the script for reset the nonHunter
                gameScript.ResetNonHunter(isLocal);
                // Destroy the script
                GameObject.Destroy(gameScript);
            } else {
                // Get a reference of the HunterController if the player has one
                gameScript = zepetoPlayer.character.GetComponent<HunterController>();
                // Check if the script is not null then destroy the script
                if (gameScript) GameObject.Destroy(gameScript);
            }
            // Get a new random spawn
            let spawnpoint = RandomSpawner.instance.GetRandomSpawnPos();

            // Teleport the player to the spawnpoint
            zepetoPlayer.character.Teleport(spawnpoint, Quaternion.identity);
        });

        // Active the team selector screen from the UIManager
        UIManager.instance.teamSelectorObj.SetActive(true);

        // Switch the game state into choosing team
        this.SetGameState(GameState.CHOOSING_TEAM);
        // Check if the event "OnReset" is not null and call it if not
        if (this.OnReset != null) this.OnReset.Invoke();
    }
}

// Enum that contains the Game state types
enum GameState {
    CHOOSING_TEAM,
    PROPS_HIDING,
    HUNTERS_SEARCHING,
    GAME_FINISH
}