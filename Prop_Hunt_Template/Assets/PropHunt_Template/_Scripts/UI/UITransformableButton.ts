import { Image, Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import TransformableItemsManager from '../Managers/TransformableItemsManager';
import Itemtransformable from '../Player/Itemtransformable';
import { GameObject } from 'UnityEngine';
import UIManager from '../Managers/UIManager';
import GameManager from '../Managers/GameManager';
// This class is responsible for the operation of the UI buttons for transformation
export default class UITransformableButton extends ZepetoScriptBehaviour {
    public icon: Image; // Reference to the property image of the icon
    public selected: GameObject; // Reference to the selected game object
    public checkMark: GameObject; // Reference to the checkmark game object
    public transformed: GameObject; // Reference to the transformed game object

    private button: Button; // Reference to the button

    @HideInInspector() public _myItemTransformable: Itemtransformable; // Saves the item for transform the player

    Awake() {
        // Get the component button and save it
        this.button = this.GetComponent<Button>();
        this.SetDefault();
    }

    Start() {
        GameManager.instance.OnReset.AddListener(()=>{
            this.SetDefault();
        });
    }

    // This function set the behaviour of the button
    public SetButton(itemTransformable: Itemtransformable) {
        // Save the item transformable reference
        this._myItemTransformable = itemTransformable;

        // Set the sprite of the icon getting it from the item
        this.icon.sprite = this._myItemTransformable.iconSprite;

        // Set the button listener
        this.button.onClick.AddListener(() => {
            this.SetSelected();
            UIManager.instance.SetPropSelectedButton(this);
        });
    }

    // This function actives the selected state
    SetSelected() {
        this.selected.SetActive(true);
        this.checkMark.SetActive(false);
        this.transformed.SetActive(false);
    }

    // This function actives the transformed state
    SetTransformed() {
        this.selected.SetActive(false);
        this.checkMark.SetActive(true);
        this.transformed.SetActive(true);
    }

    // This function actives the default state
    SetDefault() {
        this.selected.SetActive(false);
        this.checkMark.SetActive(false);
        this.transformed.SetActive(false);
    }
}