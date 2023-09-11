import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoText } from 'ZEPETO.World.Gui'

export default class WinnerScreen extends ZepetoScriptBehaviour {

    @SerializeField() private winnerTittle: ZepetoText;

    public SetWinner(huntersWins: boolean)
    {
        this.winnerTittle.text = huntersWins ? "Hunters Wins!" : "Props Wins!";
        this.gameObject.SetActive(true);
    }
}