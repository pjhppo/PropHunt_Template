import { ZepetoScriptBehaviour, ZepetoScriptableObject } from 'ZEPETO.Script'
import { GameObject, Transform } from 'UnityEngine';
import Itemtransformable from '../Player/Itemtransformable'
import UITransformableButton from '../UI/UITransformableButton';

export default class TransformableItemsManager extends ZepetoScriptBehaviour {
    public static instance: TransformableItemsManager;

    public uiTransformableButtonTemplate: GameObject;
    public transformableButtonsParent : Transform;
    public itemsTransformables : ZepetoScriptableObject<Itemtransformable>[] = [];

    Awake(){
        if (TransformableItemsManager.instance != null) GameObject.Destroy(this.gameObject);
        else TransformableItemsManager.instance = this;
    }

    Start() {    
        this.InstantiateButtons();
    }

    public InstantiateButtons()
    {
        this.itemsTransformables.forEach(element => {
            let newUITransformableButton : UITransformableButton = GameObject.Instantiate(this.uiTransformableButtonTemplate, this.transformableButtonsParent) as UITransformableButton;
            newUITransformableButton.GetComponent<UITransformableButton>().SetButton(element.targetObject);
        });
    }

    public TransformPlayer(itemId : string)
    {

    }

}