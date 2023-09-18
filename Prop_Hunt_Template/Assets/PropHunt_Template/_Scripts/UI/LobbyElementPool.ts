import { GameObject, Transform } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import UIPlayerListTemplate from '../UI/UIPlayerListTemplate';

export default class LobbyElementPool extends ZepetoScriptBehaviour {

    public uiPrefab: GameObject; // Reference of the prefab block to be used by the pool
    public parentTransform: Transform;

    private _reserve: number; // Initial amount of reservation items in this pool
    private _activeList: GameObject[]; // Internal array of active elements
    private _reserveList: GameObject[]; // Internal array of elements in reserve
    private _numberReserved: number; // Current number of items in reserve, this value is used to define if it is necessary to create new items

    // Awake is called when the script instance is being loaded
    public Awake(): void {
        // Initialized from empty arrays
        this._activeList = [];
        this._reserveList = [];

        // Default value of the reservation amount
        this._reserve = 2;

        // Allocation of the current number of items in reserve
        this._numberReserved = this._reserve;

        // Reservation Initialized
        this.initializeReserve();
    }

    // Initialization of the reservation array
    private initializeReserve() {
        for (let i = 0; i < this._reserve; i++) {
            // Instantiating a new block from the referenced prefab
            let newUiElement = GameObject.Instantiate(this.uiPrefab) as GameObject;
            newUiElement.transform.parent = this.parentTransform;
            newUiElement.SetActive(false);
            this._reserveList.push(newUiElement);
        }
    }

    // Get a block or create a new one if needed
    // This method receives as a parameter the position in which the block will be located
    public GetElement(): GameObject {
        // If there is no block available, it is created
        if (this._numberReserved == 0) {
            let newUiElement = GameObject.Instantiate(
                this.uiPrefab, 
                this.parentTransform
            ) as GameObject;

            // The new block is added to the reserve array and the reserve item counter is incremented
            this._reserveList.push(newUiElement);
            this._numberReserved++;
        }

        // Get a gameobject from the reserve array and reduce the reserve item counter
        const uiElement = this._reserveList.pop();
        this._numberReserved--;

        // The block is added to the array of active elements
        this._activeList.push(uiElement);


        // The block is located based on the position passed by parameter
        uiElement.transform.position = this.parentTransform.position;

        // It is assigned as a child of this gameobject, the default rotation is applied and it is activated
        uiElement.transform.parent = this.parentTransform;
        uiElement.transform.rotation = this.parentTransform.rotation;
        uiElement.SetActive(true);

        // Finally, the block reference is returned
        return uiElement;
    }

    // This method receives a block by parameter and returns it to the reserve array
    public ReturnElement(gameObject: GameObject) {
        // Get the index of the gameObject in the active array
        const index = this._activeList.indexOf(gameObject);
        if (index >= 0) {
            // The block is removed from the active array
            this._activeList.splice(index, 1);

            // And is added to the reserve array
            this._reserveList.push(gameObject);
            this._numberReserved++;

            gameObject.SetActive(false);
        }
    }

    public ReturnElementById(sessionId: string)
    {
        this._activeList.forEach(element => {
            if(element.GetComponent<UIPlayerListTemplate>().GetUser() == sessionId)
            {
                this.ReturnElement(element);
            }
        });
    }

    // This function returns the active list
    public GetActiveList(): GameObject[]
    {
        return this._activeList;
    }
}