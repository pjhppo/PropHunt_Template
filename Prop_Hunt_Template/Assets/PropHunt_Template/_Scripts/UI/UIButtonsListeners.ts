import { Button } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import UIManager from '../Managers/UIManager';
import GameManager from '../Managers/GameManager';
import { LocalPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';

export default class UIButtonsListeners extends ZepetoScriptBehaviour {
    @SerializeField() private readyButton: Button;
    @SerializeField() private switchToPropButton: Button;
    @SerializeField() private switchToHunterButton: Button;

    private localPlayer: LocalPlayer;
    Start() {
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.localPlayer = ZepetoPlayers.instance.LocalPlayer;
        });


        this.switchToHunterButton.onClick.AddListener(() => {
            UIManager.instance.ChangeTeam(this.localPlayer.zepetoPlayer.userId, true);
        });

        this.switchToPropButton.onClick.AddListener(() => {
            UIManager.instance.ChangeTeam(this.localPlayer.zepetoPlayer.userId, false);
        });

        this.readyButton.onClick.AddListener(() => {
            
        });
    }
}