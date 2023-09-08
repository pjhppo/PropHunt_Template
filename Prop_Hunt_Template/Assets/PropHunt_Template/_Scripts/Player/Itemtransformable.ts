import { BoxCollider, GameObject, Material, Mesh, MeshFilter, MeshRenderer, Sprite } from 'UnityEngine'
import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GameManager from '../Managers/GameManager';

export default class Itemtransformable extends ZepetoScriptBehaviour {
    
    public itemId: string;
    
    public itemPrefab: GameObject;
    public iconSprite: Sprite;

    private model: MeshFilter;
    private modelCollider: BoxCollider;
    private modelMaterial: Material;

    private button: Button;

    public GetModel(): MeshFilter {
        this.model = this.itemPrefab.GetComponent<MeshFilter>();
        return this.model;
    }

    public GetModelCollider(): BoxCollider {
        this.modelCollider = this.itemPrefab.GetComponent<BoxCollider>();
        return this.modelCollider;
    }

    public GetModelMaterial(): Material {
        this.modelMaterial = this.itemPrefab.GetComponent<MeshRenderer>().material;
        return this.modelMaterial;
    }


}