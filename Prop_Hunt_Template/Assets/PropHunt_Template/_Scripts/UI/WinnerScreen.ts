import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoText } from 'ZEPETO.World.Gui'
import MultiplayerPropHuntManager from '../Multiplayer/MultiplayerPropHuntManager';
import { GameObject, Transform } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import GameManager from '../Managers/GameManager';
import UIManager from '../Managers/UIManager';

// This class controls the winner screen
export default class WinnerScreen extends ZepetoScriptBehaviour {

    @SerializeField() private winnerTittle: ZepetoText; // Reference to the winner tittle text

    @SerializeField() private winnerParent: Transform;
    @SerializeField() private winnerPrefab: GameObject;

    @SerializeField() private txtTimeRemaining: ZepetoText;

    private winnersList: GameObject[] = [];

    // This function shows the winner on the screen
    public SetWinner(huntersWins: boolean) {
        // Change the text to show who won
        this.winnerTittle.text = huntersWins ? "Hunters Wins!" : "Props Wins!";
        // Active this game object
        this.gameObject.SetActive(true);

        // Get the formatted time from UIManager
        this.txtTimeRemaining.text = "Remaining time " + UIManager.instance.txtTime.text;

        // Call to the function to Show the winners
        this.ShowWinners(huntersWins);
    }

    // This function instantiates the winners on the winner screen
    public ShowWinners(hunterWins: boolean) {
        // Delete winners if they are there
        this.DeleteWinners();
        
        // For each player saved on the multiplayer manager
        MultiplayerPropHuntManager.instance.playersData.forEach((player) => {
            // Check if the player is part of the winner team
            if (player.isHunter == hunterWins) {
                // Instance the winner
                let winnerObj: GameObject = GameObject.Instantiate(this.winnerPrefab, this.winnerParent) as GameObject;
                // Save the name of the player
                let playerName = ZepetoPlayers.instance.GetPlayer(player.sessionId).name;
                // Set the name of the player
                winnerObj.GetComponentInChildren<ZepetoText>().text = playerName;
                // Add the player to the array of winners
                this.winnersList.push(winnerObj);
            }
        });
    }

    // This function destroys the winners that are in the winnerList array
    DeleteWinners() {
        for (let index = 0; index < this.winnersList.length; index++) {
            GameObject.Destroy(this.winnersList[index]);
        }
        // Reset the list to the default value
        this.winnersList = [];
    }
}