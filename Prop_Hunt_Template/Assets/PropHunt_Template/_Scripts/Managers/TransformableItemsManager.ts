import { ZepetoScriptBehaviour, ZepetoScriptableObject } from 'ZEPETO.Script'
import { GameObject, Transform } from 'UnityEngine';
import Itemtransformable from '../Player/Itemtransformable'
import UITransformableButton from '../UI/UITransformableButton';
import MultiplayerPropHuntManager from '../Multiplayer/MultiplayerPropHuntManager';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import NonHunterController from '../Player/NonHunterController';

// This function controls the way props transform into objects
export default class TransformableItemsManager extends ZepetoScriptBehaviour {
    public static instance: TransformableItemsManager; // Is used for the singleton pattern

    // Reference of the prefab to instance the button of an item to transform
    public uiTransformableButtonTemplate: GameObject;

    // Reference to the parent of where the buttons will be instanced
    public transformableButtonsParent: Transform;

    // List of the objects that will have the game 
    // Note: They are scriptable objects see this if you don't are used to use them
    // https://docs.zepeto.me/studio/reference/scriptableobject
    public itemsTransformablesSO: ZepetoScriptableObject<Itemtransformable>[] = [];

    // This map will contain a list of items for transform the player by the id of the item
    private _allItemsTransformables: Map<string, GameObject[]> = new Map<string, GameObject[]>();
    // Contains the list of the buttons that will be created
    private _allButtons: UITransformableButton[];

    Awake() {
        // Singleton pattern
        if (TransformableItemsManager.instance != null) GameObject.Destroy(this.gameObject);
        else TransformableItemsManager.instance = this;

        // Array initialization
        this._allButtons = [];
    }

    Start() {
        // Call to the function to instance the buttons for the props
        this.InstantiateButtons();
    }

    // This function is responsible for instantiating, setting, and storing buttons in their array
    public InstantiateButtons() {
        // The foreach is a loop to reach every item of an iterable variable
        this.itemsTransformablesSO.forEach(element => {
            // We instance the button and save a reference on a variable
            let newUITransformableButton = GameObject.Instantiate(this.uiTransformableButtonTemplate, this.transformableButtonsParent) as GameObject;
            
            // We save a variable with the script of the button
            let buttonScript = newUITransformableButton.GetComponent<UITransformableButton>();
            
            // Then we call at the function "SetButton" on the script
            buttonScript.SetButton(element.targetObject);

            // To finish we push the button script to the _allButtons array
            this._allButtons.push(buttonScript);
        });
    }

    // This function transforms the players who have decided to transform into an object
    public TransformPlayer(itemId: string, sessionId: string) {
        // Call to a function to check if the item exist and return if it is not
        if (!this.CheckItemExist(itemId)) return;

        // Get a reference of the playerData that will be transform
        let playerData = MultiplayerPropHuntManager.instance.GetPlayerData(sessionId);
        // Get a reference of wich item will be transformed calling at the function GetItemAvailable
        let tempItemTransfromablethis: GameObject = this.GetItemAvailable(itemId);

        // Check if the reference of the playerData is a hunter and if the item that previously got is not null
        if (tempItemTransfromablethis && !playerData.isHunter) {
            // Get reference of the zepetoPlayer that will be transformed
            const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(sessionId).character.gameObject;
            // Get his NonHunterController component
            let nonHunterScript = zepetoPlayer.GetComponent<NonHunterController>();
            // If we can get the component we call to the function to transform the player
            if (nonHunterScript) nonHunterScript.TransformIntoItem(tempItemTransfromablethis)
        }
    }

    // This functions calls to transform the local player and communicate this to the server
    public TransformLocalPlayer(itemId: string) {
        // Call to the function to change the item on the MultiplayerPropHuntManager
        MultiplayerPropHuntManager.instance.ChangeItem(itemId);
    }

    // This functions checks if an item exist and return if it is
    private CheckItemExist(itemId: string): bool {
        // Check all items id's to check if the item already exist
        if (!this._allItemsTransformables.has(itemId)) {
            // Set a variable to know if exist setting it on false for default
            let exist: bool = false;
            // For each button in all buttons
            this._allButtons.forEach(button => {
                // Check if the button has the item id
                if (button._myItemTransformable.itemId == itemId) {
                    // Set a new space in the map with the id
                    this._allItemsTransformables.set(itemId, []);
                    // Call the function to create a new item
                    this.CreateNewItem(itemId);
                    // Set that the item exist
                    exist = true;
                }
            });
            // Returns true if the item got created and false if not
            return exist;
        } else {
            // If the item already exist returns true
            return true;
        }
    }

    // This function checks if there is an instantiated object that is not being used, 
    // and if there isn't, it creates a new one for the user who is requesting it
    private GetItemAvailable(itemId: string): GameObject {
        // Set a variable with the list of items required
        let items = this._allItemsTransformables.get(itemId);
        // Create a variable to save the item that we will return
        let item;

        // Create a flag to know if there is an item available
        let itemAvailable: bool = false;
        // Loop through the items variable
        for (let index = 0; index < items.length; index++) {
            // Save the curren item
            const currentItem = items[index];

            // Check if the item is unactive to know if it is available
            if (!currentItem.activeSelf) {
                // Save the current item into the item variable
                item = currentItem;
                // Set the flag on true
                itemAvailable = true;
                // Stop the loop
                break;
            }
        }
        // Check if it was not an item available
        if (!itemAvailable) {
            // Create and save a new item
            item = this.CreateNewItem(itemId);
        }
        // Return the item
        return item;
    }

    // This function creates a new object and stores it, also returns it
    private CreateNewItem(itemId: string): GameObject {
        // Create a variable to save the item that we will return
        let item: GameObject;
        // For each button in allButtons
        this._allButtons.forEach(button => {
            // Check the button has the itemId passed by parameter
            if (button._myItemTransformable.itemId == itemId) {
                // Instance a new item and save it into the item variable
                item = GameObject.Instantiate(button._myItemTransformable.itemPrefab, this.transform) as GameObject;
                // Then unactive the item
                item.SetActive(false);

                // Get the item list of the itemId type, and push the new item in the list
                this._allItemsTransformables.get(itemId).push(item);
                // Get the item list and save it into a new variable
                let savedItems = this._allItemsTransformables.get(itemId);
                // Set the new list into the list of the itemId type
                this._allItemsTransformables.set(itemId, savedItems);

                // Return the item created
                return item;
            }
        });
        // Returns null/undefined
        return item;
    }
}