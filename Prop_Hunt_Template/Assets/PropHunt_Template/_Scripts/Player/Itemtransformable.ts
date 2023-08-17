import { Camera, Collider, GameObject, Physics, Ray, RaycastHit, Vector3 } from 'UnityEngine'
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import EventHandler from '../EventHandler';
import { InputAction } from 'UnityEngine.InputSystem';

export default class Itemtransformable extends ZepetoScriptBehaviour {
    public model: GameObject;
    public modelCollider: Collider;

    private player: GameObject;
    private event: EventHandler;

    private mainCamera: Camera;

    Start() {

        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this.player = ZepetoPlayers.instance.LocalPlayer.gameObject;
            this.mainCamera = ZepetoPlayers.instance.ZepetoCamera.camera;
        });

        let action: InputAction = ZepetoPlayers.instance.controllerData.inputAsset.FindActionMap("UI").FindAction("Click");
        action.add_performed(() => {
            this.OnClickItem();
        });
    }

    Update() {

    }

    public TransformPlayer() {
        console.log("Button interaction");

        this.player.gameObject.SetActive(false);
    }
    OnClickItem() {
        let ray: Ray = new Ray(this.mainCamera.transform.position, this.mainCamera.transform.forward);
        let hit = $ref<RaycastHit>();
        let item: Itemtransformable = null;
        if (Physics.Raycast(ray, hit, 50)) {
            let hitInfo = $unref(hit);

            if (hitInfo.transform.TryGetComponent<Itemtransformable>($ref(item))) console.log("Objeto transformable");

            console.log("Object hit: " + hitInfo.collider.name);

        } else {
            console.log("No object hit");
            console.log("Ray origin: " + ray.origin.x + " / " + ray.origin.y + " / " + ray.origin.z);
            console.log("Ray direction: " + ray.direction.x + " / " + ray.direction.y + " / " + ray.direction.z);
        }

    }
}