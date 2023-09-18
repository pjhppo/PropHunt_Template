import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

// This class holds the data of the players
export default class PlayerModel extends ZepetoScriptBehaviour {
    public sessionId: string; // Session id to identify the player on local
    public playerName: string; // The player name
    public isHunter: boolean; // Bool to know if the player is hunter or not
    public isReady: boolean; // Bool to know if the player is ready to start the game
    public itemId: string; // Item id for transform the player into a prop
}