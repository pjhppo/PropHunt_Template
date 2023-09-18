import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoText } from 'ZEPETO.World.Gui'

// This class controls the winner screen
export default class WinnerScreen extends ZepetoScriptBehaviour {

    @SerializeField() private winnerTittle: ZepetoText; // Reference to the winner tittle text

    // This function shows the winner on the screen
    public SetWinner(huntersWins: boolean)
    {
        // Change the text to show who won
        this.winnerTittle.text = huntersWins ? "Hunters Wins!" : "Props Wins!";
        // Active this game object
        this.gameObject.SetActive(true);
    }
}