import { SandboxPlayer } from "ZEPETO.Multiplay";
import { IModule } from "../IModule";

export default class SyncPropHuntComponentModule extends IModule {
    
    private playerDataModelCaches : PlayerDataModel[] = [];

    async OnCreate() {
        this.server.onMessage<PlayerDataModel>(GAME_MESSAGE.SEND_PLAYERDATAMODEL, (client, playerData: PlayerDataModel) =>
        {
            console.log("ON DATA MODEL ARRIVE: " + playerData.isReady);
        });

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
            this.server.broadcast(GAME_MESSAGE.AddPlayer, playerDataModelTemp);
        });

        this.server.onMessage(GAME_MESSAGE.EditDataModel, (client, message: PlayerDataModel) =>{
            
            for (const player of this.playerDataModelCaches) 
            {   
                if(player.id == message.id)
                {
                    player.isHunter = message.isHunter;
                    player.isReady = message.isReady;
                }
            }
            console.log("Edito: " + message.isReady); 
        });

        this.server.onMessage(GAME_MESSAGE.Request_AddPlayer, (client)=>{
            for (const obj of this.playerDataModelCaches) {
                client.send(GAME_MESSAGE.AddPlayer, obj);
            }
        });

        this.server.onMessage(GAME_MESSAGE.Request_EditDataModel, (client)=>{
            for (const obj of this.playerDataModelCaches) {
                client.send(GAME_MESSAGE.EditDataModel, obj);
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
    Request_AddPlayer = "Request_AddPlayer",
    Request_EditDataModel = "Request_EditDataModel",
    SEND_TEST = "SEND_TEST",
    ON_TEST = "ON_TEST",
    SEND_PLAYERDATAMODEL = "SEND_PLAYERDATAMODEL",
}

interface PlayerDataModel {
    id: string;
    isHunter: boolean;
    isReady: boolean;
}