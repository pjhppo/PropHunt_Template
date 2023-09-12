import { Image, Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import TransformableItemsManager from '../Managers/TransformableItemsManager';
import Itemtransformable from '../Player/Itemtransformable';

export default class UITransformableButton extends ZepetoScriptBehaviour {

    public icon: Image;
    private button: Button;

    @NonSerialized() public _myItemTransformable: Itemtransformable;

    Awake() {
        this.button = this.GetComponent<Button>();
    }

    public SetButton(itemTransformable: Itemtransformable) {
        this._myItemTransformable = itemTransformable;

        this.icon.sprite = this._myItemTransformable.iconSprite;

        this.button.onClick.AddListener(() => {
            TransformableItemsManager.instance.TransformLocalPlayer(this._myItemTransformable.itemId);
        });
    }
}