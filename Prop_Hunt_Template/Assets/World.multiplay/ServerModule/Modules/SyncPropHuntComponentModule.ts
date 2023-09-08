import { SandboxPlayer } from "ZEPETO.Multiplay";
import { IModule } from "../IModule";

export default class SyncPropHuntComponentModule extends IModule {
    
    private playerDataModelCaches : PlayerDataModel[] = [];

    async OnCreate() {
        this.server.onMessage(GAME_MESSAGE.AddPlayer, (client, message) =>
        {
            const playerDataModelTemp: PlayerDataModel = 
            {
                sessionId: client.sessionId,
                playerName: message,
                isHunter: false,
                isReady: false,
                itemId: "",
            };
            this.playerDataModelCaches.push(playerDataModelTemp);
            console.log("Llego: " + playerDataModelTemp.sessionId);

            this.playerDataModelCaches.forEach((player) => {
                this.server.broadcast(GAME_MESSAGE.OnAddPlayerArrived, player);
            });
        });

        this.server.onMessage(GAME_MESSAGE.EditDataModel, (client, message: PlayerDataModel) =>{
    
            this.playerDataModelCaches.forEach((player) => {
                if(player.sessionId == client.sessionId)
                {
                    player.isHunter = message.isHunter;
                    player.isReady = message.isReady;
                    player.itemId = message.itemId;
                }
                this.server.broadcast(GAME_MESSAGE.OnDataModelArrived, player);
            });

            console.log("Edito: " + message.sessionId + " ItemID: " + message.itemId); 
        });

        this.server.onMessage(GAME_MESSAGE.Request_StartGame, (client)=>{
            let allPlayersReady : boolean;
            allPlayersReady = this.playerDataModelCaches.every((playerCache) => playerCache.isReady == true);

            if(allPlayersReady)
            {
                console.log("StartGame: " + allPlayersReady);
                this.server.broadcast(GAME_MESSAGE.OnStartGameArrived, "");
            }
         });
    }

    async OnJoin(client: SandboxPlayer) {}

    async OnLeave(client: SandboxPlayer) {}

    OnTick(deltaTime: number) {}

}

enum GAME_MESSAGE {
    AddPlayer = "AddPlayer",
    EditDataModel = "EditDataModel",
    Request_EditDataModel = "Request_EditDataModel",
    Request_StartGame = "Request_StartGame",
    OnAddPlayerArrived = "OnAddPlayerArrived",
    OnDataModelArrived = "OnDataModelArrived",
    OnStartGameArrived = "OnStartGameArrived",
    SEND_TEST = "SEND_TEST",
    ON_TEST = "ON_TEST",
    SEND_PLAYERDATAMODEL = "SEND_PLAYERDATAMODEL",
}

interface PlayerDataModel {
    sessionId: string;
    playerName: string;
    isHunter: boolean;
    isReady: boolean;
    itemId: string;
}