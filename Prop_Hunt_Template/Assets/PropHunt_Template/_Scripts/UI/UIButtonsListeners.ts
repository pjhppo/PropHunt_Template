import { Button } from 'UnityEngine.UI'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import MultiplayerPropHuntManager from '../Multiplayer/MultiplayerPropHuntManager';

export default class UIButtonsListeners extends ZepetoScriptBehaviour {
    @SerializeField() private readyButton: Button;
    @SerializeField() private switchToPropButton: Button;
    @SerializeField() private switchToHunterButton: Button;

    private isHunter: boolean;

    Start() {
        this.switchToPropButton.interactable = false;

        this.switchToHunterButton.onClick.AddListener(() => 
        {
            this.isHunter = true;
            MultiplayerPropHuntManager.instance.ChangeTeam(this.isHunter);

            this.switchToHunterButton.interactable = false;
            this.switchToPropButton.interactable = true;
        });

        this.switchToPropButton.onClick.AddListener(() => 
        {
            this.isHunter = false;
            MultiplayerPropHuntManager.instance.ChangeTeam(this.isHunter);

            this.switchToPropButton.interactable = false;
            this.switchToHunterButton.interactable = true;
        });

        //Esto va segun jugador(ID - Multiplayer)
        this.readyButton.onClick.AddListener(() => {
            MultiplayerPropHuntManager.instance.SetReady(true);
            
            this.switchToHunterButton.interactable = false;
            this.switchToPropButton.interactable = false;
        });
    }
}