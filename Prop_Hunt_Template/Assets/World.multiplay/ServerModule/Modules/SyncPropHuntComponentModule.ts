import { SandboxPlayer } from "ZEPETO.Multiplay";
import { IModule } from "../IModule";

export default class SyncPropHuntComponentModule extends IModule {
    
    async OnCreate() {
        
        this.server.onMessage(GAME_MESSAGE.SEND_TEST, (client, message) =>
        {
            console.log("LLEGO MENSAGE : " + message);
            this.server.broadcast(GAME_MESSAGE.ON_TEST, "ESTE ES UN MSJ DEL SERVIDOR");
            console.log("PONG DEL SERVIDOR");
        });

        this.server.onMessage<PlayerDataModel>(GAME_MESSAGE.SEND_PLAYERDATAMODEL, (client, playerData: PlayerDataModel) =>
        {
            console.log("ON DATA MODEL ARRIVE: " + playerData.itemId);
        });

    }

    async OnJoin(client: SandboxPlayer) {}

    async OnLeave(client: SandboxPlayer) {}

    OnTick(deltaTime: number) {}

}

enum GAME_MESSAGE {
    SEND_TEST = "SEND_TEST",
    ON_TEST = "ON_TEST",
    SEND_PLAYERDATAMODEL = "SEND_PLAYERDATAMODEL",
}

interface PlayerDataModel {
    itemId: string;
}