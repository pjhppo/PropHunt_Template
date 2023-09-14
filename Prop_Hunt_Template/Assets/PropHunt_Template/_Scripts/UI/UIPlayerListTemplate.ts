import { Color, Transform, Vector3 } from 'UnityEngine';
import { Image } from 'UnityEngine.UI';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoText } from 'ZEPETO.World.Gui'
import MultiplayerPropHuntManager from '../Multiplayer/MultiplayerPropHuntManager';
import UIManager from '../Managers/UIManager';

export default class UIPlayerListTemplate extends ZepetoScriptBehaviour {

    @SerializeField() private txtName: ZepetoText;
    @SerializeField() private readyIcon: Image;

    public _user: string;

    Start()
    {
        this.readyIcon.color = Color.yellow
    }

    public Populate(sessionId: string)
    {
        this._user = sessionId;
        this.txtName.text = ZepetoPlayers.instance.GetPlayer(sessionId).name;
        this.SetReady(MultiplayerPropHuntManager.instance.GetPlayerData(sessionId).isReady);

        if (MultiplayerPropHuntManager.instance.GetPlayerData(sessionId).isHunter)
        {
            this.ChangeParent(UIManager.instance.GetLobbyHunterParent());
        }
        else
        {
            this.ChangeParent(UIManager.instance.GetLobbyNonHunterParent());
        }

        this.transform.localScale = Vector3.one;
    }

    public RefreshData()
    {
        
    }

    GetUser() 
    {
        return this._user;
    }

    SetUser(user: string) 
    {
        this._user = user;
    }

    SetDisplayName(text: string) 
    {
        this.txtName.text = text;
    }

    public SetReady(isReady : boolean)
    {
        if (isReady)
        {
            this.readyIcon.color = Color.green;
        }
        else
        {
            this.readyIcon.color = Color.yellow;
        }
    }

    public ChangeParent(newParent: Transform)
    {
        this.transform.SetParent(newParent);
    }
}