import { Button } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import MultiplayerPropHuntManager from '../Multiplayer/MultiplayerPropHuntManager';
import GameManager from '../Managers/GameManager';

export default class UIButtonsListeners extends ZepetoScriptBehaviour {
    @SerializeField() private readyButton: Button;
    @SerializeField() private switchTeamButton: Button;
    @SerializeField() private resetButton: Button;


    Start() {
        this.switchTeamButton.onClick.AddListener(() => {
            MultiplayerPropHuntManager.instance.SwitchTeam();
        });

        //Esto va segun jugador(ID - Multiplayer)
        this.readyButton.onClick.AddListener(() => {
            MultiplayerPropHuntManager.instance.SwitchReady();
            let activeButtons: boolean = !MultiplayerPropHuntManager.instance.GetReady();
            this.switchTeamButton.interactable = activeButtons;
        });

        this.resetButton.onClick.AddListener(() => {
            GameManager.instance.ResetGame();
        });
    }
}