import { Color, Coroutine, Debug, Sprite, Transform, Vector3, WaitForSeconds } from 'UnityEngine';
import { Image } from 'UnityEngine.UI';
import { ZepetoPlayer, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoText } from 'ZEPETO.World.Gui'
import MultiplayerPropHuntManager from '../Multiplayer/MultiplayerPropHuntManager';
import UIManager from '../Managers/UIManager';

// This class controls each player tab of the player list on the lobby
export default class UIPlayerListTemplate extends ZepetoScriptBehaviour {
    @SerializeField() private propColor: Color;
    @SerializeField() private hunterColor: Color;

    @SerializeField() private txtName: ZepetoText; // Reference to the text of the name
    @SerializeField() private readyTextImg: Image; // Reference to the ready text image
    @SerializeField() private checkmarkImg: Image; // Reference to the checkmark image
    @SerializeField() private readyIcon: Image; // Reference to the ready icon

    public _isHunter: bool; // Saves if is hunter or prop
    public _user: string; // Saves the name of the user

    coroutineWaiting: Coroutine;

    // This function populates the tab for the player passed as parameter
    public Populate(sessionId: string, teamChanged: bool = false, isFirstCharge: bool = false) {
        // Save the session id
        this._user = sessionId;

        const player: ZepetoPlayer = ZepetoPlayers.instance.GetPlayer(sessionId);
        const thumb: Sprite = UIManager.instance.thumbnailsCreator.GetPlayerThumb(player.userId);

        if (thumb) this.readyIcon.sprite = thumb;
        else if (!this.coroutineWaiting) this.coroutineWaiting = this.StartCoroutine(this.WaitForSprite(player.userId));

        // Change the name text by getting the player name with the session id
        this.txtName.text = player.name;

        // Check if the player is hunter
        if (MultiplayerPropHuntManager.instance.GetPlayerData(sessionId).isHunter) {
            // Call to the function to change the parent getting the parent from the UIManager
            this.ChangeParent(UIManager.instance.GetLobbyHunterParent());
            this._isHunter = true;
            if (teamChanged) UIManager.instance.UpdateCountersInLobby(true);
            if (isFirstCharge) UIManager.instance.AddOneCounterInLobby(true);
        }
        else {
            // Call to the function to change the parent getting the parent from the UIManager
            this.ChangeParent(UIManager.instance.GetLobbyNonHunterParent());
            this._isHunter = false;
            if (teamChanged) UIManager.instance.UpdateCountersInLobby(false);
            if (isFirstCharge) UIManager.instance.AddOneCounterInLobby(false);
        }

        // Set the scale of this on one (1,1,1)
        this.transform.localScale = Vector3.one;
        this.SetHunter(this._isHunter);
    }

    // This function returns the user
    GetUser() {
        return this._user;
    }

    // This function sets the user
    SetUser(user: string) {
        this._user = user;
    }

    // This function sets the displayed name
    SetDisplayName(text: string) {
        this.txtName.text = text;
    }

    // This function set the color of the label if it is hunter or not
    public SetHunter(isHunter: bool) {
        if (isHunter) {
            this.txtName.color = this.hunterColor;
            this.readyTextImg.color = this.hunterColor;
            this.checkmarkImg.color = this.hunterColor;
        } else {
            this.txtName.color = this.propColor;
            this.readyTextImg.color = this.propColor;
            this.checkmarkImg.color = this.propColor;
        }
    }

    // This function changes the parent of this to the transform sended as parameter
    public ChangeParent(newParent: Transform) {
        this.transform.SetParent(newParent);
    }

    *WaitForSprite(userId: string) {
        let thumb: Sprite = UIManager.instance.thumbnailsCreator.GetPlayerThumb(userId);
        while (thumb == null) {
            yield new WaitForSeconds(3);
            thumb = UIManager.instance.thumbnailsCreator.GetPlayerThumb(userId);
        }
        this.readyIcon.sprite = thumb;
        yield null;
    }
}