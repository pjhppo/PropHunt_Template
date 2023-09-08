import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class PlayerModel extends ZepetoScriptBehaviour {

    public sessionId: string;
    public playerName: string;
    public isHunter: boolean;
    public isReady: boolean;
    public itemId: string;

}