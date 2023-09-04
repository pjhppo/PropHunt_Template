import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoText } from 'ZEPETO.World.Gui'

export default class UIPlayerListTemplate extends ZepetoScriptBehaviour {

    @SerializeField() private txtName: ZepetoText;

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
}