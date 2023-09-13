import { ZepetoScriptBehaviour, ZepetoScriptableObject } from 'ZEPETO.Script'
import { GameObject, Transform } from 'UnityEngine';
import Itemtransformable from '../Player/Itemtransformable'
import UITransformableButton from '../UI/UITransformableButton';
import GameManager from './GameManager';
import MultiplayerPropHuntManager from '../Multiplayer/MultiplayerPropHuntManager';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import NonHunterController from '../Player/NonHunterController';
import { TMPro_ExtensionMethods } from 'TMPro';

export default class TransformableItemsManager extends ZepetoScriptBehaviour {
    public static instance: TransformableItemsManager;

    public uiTransformableButtonTemplate: GameObject;
    public transformableButtonsParent: Transform;
    public itemsTransformablesSO: ZepetoScriptableObject<Itemtransformable>[] = [];

    private _allItemsTransformables: Map<string, GameObject[]> = new Map<string, GameObject[]>();
    private _allButtons: UITransformableButton[];

    Awake() {
        if (TransformableItemsManager.instance != null) GameObject.Destroy(this.gameObject);
        else TransformableItemsManager.instance = this;

        this._allButtons = [];
    }

    Start() {
        this.InstantiateButtons();
    }

    public InstantiateButtons() {
        this.itemsTransformablesSO.forEach(element => {
            let newUITransformableButton: UITransformableButton = GameObject.Instantiate(this.uiTransformableButtonTemplate, this.transformableButtonsParent) as UITransformableButton;
            newUITransformableButton.GetComponent<UITransformableButton>().SetButton(element.targetObject);

            this._allButtons.push(newUITransformableButton.GetComponent<UITransformableButton>());
        });
    }

    public TransformPlayer(itemId: string, sessionId: string) {

        if (!this.CheckItemExist(itemId)) return;

        let playerData = MultiplayerPropHuntManager.instance.GetPlayerData(sessionId);
        let tempItemTransfromablethis: GameObject = this.GetItemAvailable(itemId);

        if (tempItemTransfromablethis && !playerData.isHunter) {
            const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(sessionId).character.gameObject;
            let nonHunterScript = zepetoPlayer.GetComponent<NonHunterController>();
            if (nonHunterScript) nonHunterScript.TransformIntoItem(tempItemTransfromablethis)
        }
    }

    public TransformLocalPlayer(itemId: string) {
        MultiplayerPropHuntManager.instance.ChangeItem(itemId);
    }

    private CheckItemExist(itemId: string): bool {
        if (!this._allItemsTransformables.has(itemId)) {
            let exist: bool = false;
            this._allButtons.forEach(button => {
                if (button._myItemTransformable.itemId == itemId) {
                    this._allItemsTransformables.set(itemId, []);
                    this.CreateNewItem(itemId);
                    exist = true;
                }
            });
            return exist;
        } else {
            return true;
        }
    }

    private GetItemAvailable(itemId: string): GameObject {
        let items = this._allItemsTransformables.get(itemId);
        let item;

        let itemAvailable: bool = false;
        for (let index = 0; index < items.length; index++) {
            const currentItem = items[index];

            if (!currentItem.activeSelf) {
                item = currentItem;
                itemAvailable = true;
                break;
            }
        }
        if (!itemAvailable) {
            item = this.CreateNewItem(itemId);
        }
        return item;
    }

    private CreateNewItem(itemId: string): GameObject {
        let item: GameObject;
        this._allButtons.forEach(button => {
            if (button._myItemTransformable.itemId == itemId) {
                item = GameObject.Instantiate(button._myItemTransformable.itemPrefab, this.transform) as GameObject;
                item.SetActive(false);

                this._allItemsTransformables.get(itemId).push(item);
                let savedItems = this._allItemsTransformables.get(itemId);

                this._allItemsTransformables.set(itemId, savedItems);

                return item;
            }
        });
        return item;
    }
}