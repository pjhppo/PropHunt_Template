import { SandboxPlayer } from "ZEPETO.Multiplay";
import { IModule } from "../IModule";

export default class SyncPropHuntComponentModule extends IModule {
    
    private playerDataModelCaches : PlayerDataModel[] = [];

    async OnCreate() {

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

            // let anyHunter : boolean = false;
            // let anyProp: boolean = false;
            
            // this.playerDataModelCaches.forEach(element => {
            //     if(element.isHunter == true)
            //     {
            //         anyHunter = true;
            //     }
            //     else
            //     {
            //         anyProp = true;
            //     }
            // });


            if(allPlayersReady) // && anyHunter && anyProp)
            {
                console.log("StartGame: " + allPlayersReady);
                this.server.broadcast(GAME_MESSAGE.OnStartGameArrived, "");
            }
         });

        this.server.onMessage(GAME_MESSAGE.RequestPlayersCache, (client) =>
        {
            this.server.broadcast(GAME_MESSAGE.OnResetPlayerCache, "");
            this.playerDataModelCaches.forEach((player) => {
                this.server.broadcast(GAME_MESSAGE.OnPlayerJoin, player);
            });
        });
    }

    async OnJoin(client: SandboxPlayer) 
    {
        const newPlayer: PlayerDataModel =
        {
            sessionId: client.sessionId,
            isHunter: false,
            isReady: false,
            itemId: "",
        };
        this.playerDataModelCaches.push(newPlayer);
    }

    async OnLeave(client: SandboxPlayer) 
    {
        let index = this.playerDataModelCaches.findIndex(d => d.sessionId === client.sessionId);
        if (index > -1) {
            this.playerDataModelCaches.splice(index, 1);
        }

        this.playerDataModelCaches.forEach((player) => {
            this.server.broadcast(GAME_MESSAGE.OnPlayerLeave, player);
        });
    }

    OnTick(deltaTime: number) {}

}

enum GAME_MESSAGE {
    EditDataModel = "EditDataModel",
    Request_EditDataModel = "Request_EditDataModel",
    Request_StartGame = "Request_StartGame",
    SEND_TEST = "SEND_TEST",
    ON_TEST = "ON_TEST",
    SEND_PLAYERDATAMODEL = "SEND_PLAYERDATAMODEL",
    RequestPlayersCache = "RequestPlayersCache",
    
    OnResetPlayerCache = "OnResetPlayerCache",
    OnPlayerJoin = "OnPlayerJoin",
    OnPlayerLeave = "OnPlayerLeave",
    OnDataModelArrived = "OnDataModelArrived",
    OnStartGameArrived = "OnStartGameArrived",
}

interface PlayerDataModel {
    sessionId: string;
    isHunter: boolean;
    isReady: boolean;
    itemId: string;
}