import { Color, Transform, Vector3 } from 'UnityEngine';
import { Image } from 'UnityEngine.UI';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoText } from 'ZEPETO.World.Gui'
import MultiplayerPropHuntManager from '../Multiplayer/MultiplayerPropHuntManager';
import UIManager from '../Managers/UIManager';

// This class controls each player tab of the player list on the lobby
export default class UIPlayerListTemplate extends ZepetoScriptBehaviour {

    @SerializeField() private txtName: ZepetoText; // Reference to the text of the name
    @SerializeField() private readyIcon: Image; // Reference to the ready icon

    public _user: string; // Saves the name of the user

    Start()
    {
        // Set the color of the ready icon
        this.readyIcon.color = Color.yellow
    }

    // This function populates the tab for the player passed as parameter
    public Populate(sessionId: string)
    {
        // Save the session id
        this._user = sessionId; 
        // Change the name text by getting the player name with the session id
        this.txtName.text = ZepetoPlayers.instance.GetPlayer(sessionId).name;
        // Call to the function to set ready the player created
        this.SetReady(MultiplayerPropHuntManager.instance.GetPlayerData(sessionId).isReady);

        // Check if the player is hunter
        if (MultiplayerPropHuntManager.instance.GetPlayerData(sessionId).isHunter)
        {
            // Call to the function to change the parent getting the parent from the UIManager
            this.ChangeParent(UIManager.instance.GetLobbyHunterParent());
        }
        else
        {
            // Call to the function to change the parent getting the parent from the UIManager
            this.ChangeParent(UIManager.instance.GetLobbyNonHunterParent());
        }

        // Set the scale of this on one (1,1,1)
        this.transform.localScale = Vector3.one;
    }

    public RefreshData()
    {
        
    }

    // This function returns the user
    GetUser() 
    {
        return this._user;
    }

    // This function sets the user
    SetUser(user: string) 
    {
        this._user = user;
    }

    // This function sets the displayed name
    SetDisplayName(text: string) 
    {
        this.txtName.text = text;
    }

    // This function sets the ready state
    public SetReady(isReady : boolean)
    {
        // Check if is ready
        if (isReady)
        {
            // Change the ready icon color to green
            this.readyIcon.color = Color.green;
        }
        else
        {
            // Change the ready icon color to green
            this.readyIcon.color = Color.yellow;
        }
    }

    // This function changes the parent of this to the transform sended as parameter
    public ChangeParent(newParent: Transform)
    {
        this.transform.SetParent(newParent);
    }
}