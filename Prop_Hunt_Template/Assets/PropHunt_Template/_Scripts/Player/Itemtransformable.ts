import { BoxCollider, Mesh, MeshFilter } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'

export default class Itemtransformable extends ZepetoScriptBehaviour {
    public model: MeshFilter;
    public modelCollider: BoxCollider;

    Start() {
        let collider = this.gameObject.AddComponent<BoxCollider>();
        collider = this.modelCollider;
    }
}