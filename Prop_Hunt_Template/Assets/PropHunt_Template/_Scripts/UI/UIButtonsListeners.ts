import { Button } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import MultiplayerPropHuntManager from '../Multiplayer/MultiplayerPropHuntManager';
import GameManager from '../Managers/GameManager';
import UIManager from '../Managers/UIManager';

// This class asign the button listeners commands
export default class UIButtonsListeners extends ZepetoScriptBehaviour {
    @SerializeField() private readyButton: Button; // Reference to the ready button
    @SerializeField() private switchTeamButton: Button; // Reference to the switch team button
    @SerializeField() private resetButton: Button; // Reference to the reset button


    Start() 
    {
        // Add the listener of the OnReset event
        GameManager.instance.OnReset.AddListener(()=> {
            // Call to the function OnReset
            this.OnReset();
        });

        // Add the listener of the switch team button
        this.switchTeamButton.onClick.AddListener(() => {
            // Call to the function SwitchTeam on the MultiplayerPropHuntManager
            MultiplayerPropHuntManager.instance.SwitchTeam();
        });

        // Add the listener of the ready button
        this.readyButton.onClick.AddListener(() => {
            // Call to the function SwitchReady on the MultiplayerPropHuntManager
            MultiplayerPropHuntManager.instance.SwitchReady();
            // Get a reference of the ready state
            let activeButtons: boolean = MultiplayerPropHuntManager.instance.GetReady();
            // Set the interactable setting of the switch team button in the inverse of the activeButtons
            this.switchTeamButton.interactable = !activeButtons;
        });

        // Add the listener of the reset button
        this.resetButton.onClick.AddListener(() => {
            // Call to the function to hide the winner screen on the UIManager
            UIManager.instance.HideWinnerScreen();
            // Call to the function to reset the game on the GameManager
            GameManager.instance.ResetGame();
        });
    }

    // This function is called when reset the game
    OnReset(){
        // Set the interactable button of the switch teams in true
        this.switchTeamButton.interactable = true;
    }
}