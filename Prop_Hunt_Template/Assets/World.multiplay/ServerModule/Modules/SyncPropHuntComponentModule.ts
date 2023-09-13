import { SandboxPlayer } from "ZEPETO.Multiplay";
import { IModule } from "../IModule";

export default class SyncPropHuntComponentModule extends IModule {
    
    private playerDataModelCaches : PlayerDataModel[] = [];

    async OnCreate() {

        this.playerDataModelCaches = [];

        this.server.onMessage<PlayerDataModel>(GAME_MESSAGE.EditDataModel, (client, playerData: PlayerDataModel) =>{
            this.playerDataModelCaches.forEach((pd) => {
                if (pd.sessionId == client.sessionId)
                {
                    pd.isHunter = playerData.isHunter;
                    pd.isReady = playerData.isReady;
                    pd.itemId = playerData.itemId;

                    this.server.broadcast(GAME_MESSAGE.OnDataModelArrived, pd);
                }
            });
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

        this.server.broadcast(GAME_MESSAGE.OnResetPlayerCache, "");
        this.playerDataModelCaches.forEach((player) => {
            this.server.broadcast(GAME_MESSAGE.OnPlayerJoin, player);
        });
    }

    OnTick(deltaTime: number) {}

}

enum GAME_MESSAGE {
    EditDataModel = "EditDataModel",
    Request_StartGame = "Request_StartGame",
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