import { Color, Transform } from 'UnityEngine';
import { Image } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoText } from 'ZEPETO.World.Gui'

export default class UIPlayerListTemplate extends ZepetoScriptBehaviour {

    @SerializeField() private txtName: ZepetoText;
    @SerializeField() private readyIcon: Image;

    private _user: string;

    GetUser() {
        return this._user;
    }

    SetUser(user: string) {
        this._user = user;
    }

    SetText(text: string) {
        this.txtName.text = text;
    }

    SetColor() {

    }

    public SetReady(){
        this.readyIcon.color = Color.green;
    }

    public ChangeParent(newParent: Transform){
        this.transform.parent = newParent;
    }
}