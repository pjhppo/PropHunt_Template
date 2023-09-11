import { Color, Transform } from 'UnityEngine';
import { Image } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoText } from 'ZEPETO.World.Gui'

export default class UIPlayerListTemplate extends ZepetoScriptBehaviour {

    @SerializeField() private txtName: ZepetoText;
    @SerializeField() private readyIcon: Image;

    private _user: string;

    Start()
    {
        this.readyIcon.color = Color.yellow
    }

    GetUser() 
    {
        return this._user;
    }

    SetUser(user: string) 
    {
        this._user = user;
    }

    SetText(text: string) 
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