import { ZepetoScriptBehaviour, ZepetoScriptableObject } from 'ZEPETO.Script'
import { GameObject, Transform } from 'UnityEngine';
import Itemtransformable from '../Player/Itemtransformable'
import UITransformableButton from '../UI/UITransformableButton';
import GameManager from './GameManager';
import MultiplayerPropHuntManager from '../Multiplayer/MultiplayerPropHuntManager';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import NonHunterController from '../Player/NonHunterController';

export default class TransformableItemsManager extends ZepetoScriptBehaviour {
    public static instance: TransformableItemsManager;

    public uiTransformableButtonTemplate: GameObject;
    public transformableButtonsParent : Transform;
    public itemsTransformablesSO : ZepetoScriptableObject<Itemtransformable>[] = [];

    private _allItemsTransformables: Map<string, GameObject> = new Map<string, GameObject>();

    Awake(){
        if (TransformableItemsManager.instance != null) GameObject.Destroy(this.gameObject);
        else TransformableItemsManager.instance = this;
    }

    Start() {    
        this.InstantiateButtons();
    }

    public InstantiateButtons()
    {
        this.itemsTransformablesSO.forEach(element => {
            let newUITransformableButton : UITransformableButton = GameObject.Instantiate(this.uiTransformableButtonTemplate, this.transformableButtonsParent) as UITransformableButton;
            newUITransformableButton.GetComponent<UITransformableButton>().SetButton(element.targetObject);
            let newObjectInGame : GameObject = GameObject.Instantiate(element.targetObject.itemPrefab, this.transform) as GameObject;

            newObjectInGame.SetActive(false);

            this._allItemsTransformables.set(element.targetObject.itemId, newObjectInGame);
        });
    }

    public TransformPlayer(itemId : string, sessionId: string)
    {
        let tempItemTransfromablethis = this._allItemsTransformables.get(itemId);
        let playerData = GameManager.instance.GetPlayer(sessionId);
    
        if(tempItemTransfromablethis && !playerData.isHunter)
        {   
            const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(sessionId).character.gameObject;
            zepetoPlayer.GetComponent<NonHunterController>().TransformIntoItem(tempItemTransfromablethis);
            tempItemTransfromablethis.SetActive(true);

            console.log("Transform in: " + tempItemTransfromablethis.name + " SessionId: " + sessionId);
        }
    }

    public TransformLocalPlayer(itemId : string)
    {
        let tempItemTransfromablethis = this._allItemsTransformables.get(itemId);
        
        if(tempItemTransfromablethis)
        {
            MultiplayerPropHuntManager.instance.ChangeItem(itemId);
        }
    }
}