import { BoxCollider, GameObject, Material, Mesh, MeshFilter, MeshRenderer, Sprite } from 'UnityEngine'
import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

// This class have the items for the player transforms
export default class Itemtransformable extends ZepetoScriptBehaviour {
    public itemId: string = "none"; // Reference to the id for transform de player

    public itemPrefab: GameObject; // The item prefab to transform in
    public iconSprite: Sprite; // The icon that will be shown in the UI

    private model: MeshFilter; // The meshfilter of the model
    private modelCollider: BoxCollider; // The collider of the model
    private modelMaterial: Material; // The material of the model

    private button: Button;

    // This function returns the model mesh filter
    public GetModel(): MeshFilter {
        this.model = this.itemPrefab.GetComponent<MeshFilter>();
        return this.model;
    }

    // This function returns the model collider
    public GetModelCollider(): BoxCollider {
        this.modelCollider = this.itemPrefab.GetComponent<BoxCollider>();
        return this.modelCollider;
    }

    // This function returns the model material
    public GetModelMaterial(): Material {
        this.modelMaterial = this.itemPrefab.GetComponent<MeshRenderer>().material;
        return this.modelMaterial;
    }


}