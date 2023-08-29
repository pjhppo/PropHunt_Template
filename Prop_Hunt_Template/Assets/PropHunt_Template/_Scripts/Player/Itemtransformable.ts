import { BoxCollider, GameObject, Material, Mesh, MeshFilter, MeshRenderer } from 'UnityEngine'
import { Button } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GameManager from '../Managers/GameManager';

export default class Itemtransformable extends ZepetoScriptBehaviour {
    public itemPrefab: GameObject;

    private model: MeshFilter;
    private modelCollider: BoxCollider;
    private modelMaterial: Material;

    private button: Button;

    Start() {
        let item = GameObject.Instantiate(this.itemPrefab) as GameObject;

        this.model = item.GetComponent<MeshFilter>();
        this.modelCollider = item.GetComponent<BoxCollider>();
        this.modelMaterial = item.GetComponent<MeshRenderer>().material;

        item.SetActive(false);

        this.button = this.GetComponent<Button>();
        this.button.onClick.AddListener(() => {
            GameManager.instance.nonHunterScript.TransformIntoItem(this);
        });
    }

    public GetModel(): MeshFilter {
        return this.model;
    }

    public GetModelCollider(): BoxCollider {
        return this.modelCollider;
    }

    public GetModelMaterial(): Material {
        return this.modelMaterial;
    }
}