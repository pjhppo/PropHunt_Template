import { SandboxPlayer } from "ZEPETO.Multiplay";
import { IModule } from "../IModule";

export default class SyncPropHuntComponentModule extends IModule {
    
    private playerDataModelCaches : PlayerDataModel[] = [];

    async OnCreate() {
        this.server.onMessage(GAME_MESSAGE.AddPlayer, (client, message : PlayerDataModel) =>
        {
            const playerDataModelTemp: PlayerDataModel = 
            {
                id: message.id,
                isHunter: message.isHunter,
                isReady: message.isReady,
            };
            this.playerDataModelCaches.push(playerDataModelTemp);
            console.log("Llego: " + playerDataModelTemp.id);
        });

        this.server.onMessage(GAME_MESSAGE.EditDataModel, (client, message: PlayerDataModel) =>{
    
            
            this.playerDataModelCaches.forEach((player) => {
                if(player.id == message.id)
                {
                    player.isHunter = message.isHunter;
                    player.isReady = message.isReady;
                }
            });
            

            console.log("Edito: " + message.isReady); 
        });

        this.server.onMessage(GAME_MESSAGE.Request_AddPlayer, (client)=>{
            this.playerDataModelCaches.forEach((player) => {
                this.server.broadcast(GAME_MESSAGE.AddPlayer, player);
            });
        });

        this.server.onMessage(GAME_MESSAGE.Request_EditDataModel, (client)=>{
           this.playerDataModelCaches.forEach((player) => {
                this.server.broadcast(GAME_MESSAGE.OnDataModelArrived, player);
            });
        });

    }

    async OnJoin(client: SandboxPlayer) {}

    async OnLeave(client: SandboxPlayer) {}

    OnTick(deltaTime: number) {}

}

enum GAME_MESSAGE {
    AddPlayer = "AddPlayer",
    EditDataModel = "EditDataModel",
    Request_AddPlayer = "Request_AddPlayer",
    Request_EditDataModel = "Request_EditDataModel",
    OnDataModelArrived = "OnDataModelArrived",
    SEND_TEST = "SEND_TEST",
    ON_TEST = "ON_TEST",
    SEND_PLAYERDATAMODEL = "SEND_PLAYERDATAMODEL",
}

interface PlayerDataModel {
    id: string;
    isHunter: boolean;
    isReady: boolean;
}