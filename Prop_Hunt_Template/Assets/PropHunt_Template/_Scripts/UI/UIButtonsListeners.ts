import { Button } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import UIManager from '../Managers/UIManager';
import GameManager from '../Managers/GameManager';
import { LocalPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import MultiplayManager from '../../../Zepeto Multiplay Component/ZepetoScript/Common/MultiplayManager';

export default class UIButtonsListeners extends ZepetoScriptBehaviour {
    @SerializeField() private readyButton: Button;
    @SerializeField() private switchToPropButton: Button;
    @SerializeField() private switchToHunterButton: Button;

    private isHunter: boolean;

    Start() {
        this.switchToHunterButton.onClick.AddListener(() => {
            this.isHunter = true;
            MultiplayManager.instance.ChangeTeam(this.isHunter);
        });

        this.switchToPropButton.onClick.AddListener(() => {
            this.isHunter = false;
            MultiplayManager.instance.ChangeTeam(this.isHunter);
        });

        //Esto va segun jugador(ID - Multiplayer)
        this.readyButton.onClick.AddListener(() => {
            MultiplayManager.instance.SetReady(true);
        });
    }
}