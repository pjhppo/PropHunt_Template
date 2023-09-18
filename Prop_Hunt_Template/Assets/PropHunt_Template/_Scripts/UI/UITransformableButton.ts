import { Image, Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import TransformableItemsManager from '../Managers/TransformableItemsManager';
import Itemtransformable from '../Player/Itemtransformable';
// This class is responsible for the operation of the UI buttons for transformation
export default class UITransformableButton extends ZepetoScriptBehaviour {
    public icon: Image; // Reference to the property image of the icon
    private button: Button; // Reference to the button

    @NonSerialized() public _myItemTransformable: Itemtransformable; // Saves the item for transform the player

    Awake() {
        // Get the component button and save it
        this.button = this.GetComponent<Button>();
    }

    // This function set the behaviour of the button
    public SetButton(itemTransformable: Itemtransformable) {
        // Save the item transformable reference
        this._myItemTransformable = itemTransformable;

        // Set the sprite of the icon getting it from the item
        this.icon.sprite = this._myItemTransformable.iconSprite;

        // Set the button listener
        this.button.onClick.AddListener(() => {
            // Call to the function to transform the player from the TransformableItemsManager
            TransformableItemsManager.instance.TransformLocalPlayer(this._myItemTransformable.itemId);
        });
    }
}