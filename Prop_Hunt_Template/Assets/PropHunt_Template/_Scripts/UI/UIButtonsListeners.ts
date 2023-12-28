import { Button } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import MultiplayerPropHuntManager from '../Multiplayer/MultiplayerPropHuntManager';
import GameManager from '../Managers/GameManager';
import UIManager from '../Managers/UIManager';
import TransformableItemsManager from '../Managers/TransformableItemsManager';
import UITransformableButton from './UITransformableButton';
import { GameObject } from 'UnityEngine';

// This class asign the button listeners commands
export default class UIButtonsListeners extends ZepetoScriptBehaviour {
    @SerializeField() private readyButton: Button; // Reference to the ready button
    @SerializeField() private readyBtn_Pressed: GameObject; // Reference to the ready button active
    @SerializeField() private readyBtn_NonPressed: GameObject; // Reference to the ready button unactive
    @SerializeField() private switchTeamButton: Button; // Reference to the switch team button
    @SerializeField() private resetButton: Button; // Reference to the reset button

    @SerializeField() private releaseButton: Button;
    @SerializeField() private transformButton: Button;

    private buttonTransformed: UITransformableButton;

    Start() {
        // Add the listener of the OnReset event
        GameManager.instance.OnReset.AddListener(() => {
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

            this.readyBtn_Pressed.SetActive(activeButtons);
            this.readyBtn_NonPressed.SetActive(!activeButtons);
        });

        // Add the listener of the reset button
        this.resetButton.onClick.AddListener(() => {
            // Call to the function to hide the winner screen on the UIManager
            UIManager.instance.HideWinnerScreen();
            // Call to the function to reset the game on the GameManager
            GameManager.instance.ResetGame();
        });

        this.releaseButton.onClick.AddListener(() => {
            if (this.buttonTransformed) this.buttonTransformed.SetDefault();
            UIManager.instance.ResetPropSelectedButton();
            TransformableItemsManager.instance.TransformLocalPlayer("");
        });

        this.transformButton.onClick.AddListener(() => {
            if (this.buttonTransformed) this.buttonTransformed.SetDefault();
            this.buttonTransformed = UIManager.instance.buttonSelected;
            if (this.buttonTransformed) {
                this.buttonTransformed.SetTransformed();

                // Call to the function to transform the player from the TransformableItemsManager
                TransformableItemsManager.instance.TransformLocalPlayer(UIManager.instance.buttonSelected._myItemTransformable.itemId);
            }
        });
    }

    // This function is called when reset the game
    OnReset() {
        // Set the interactable button of the switch teams in true
        this.switchTeamButton.interactable = true;
        // Set the ready btn in the default state
        this.readyBtn_Pressed.SetActive(false);
        this.readyBtn_NonPressed.SetActive(true);
    }
}