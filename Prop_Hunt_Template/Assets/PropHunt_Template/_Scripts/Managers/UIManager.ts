import { GameObject, Vector3, WaitForSeconds } from 'UnityEngine';
import { Image } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoText } from 'ZEPETO.World.Gui';

export default class UIManager extends ZepetoScriptBehaviour {
    public static instance: UIManager;

    public iconImagePrefab: GameObject;

    public icon: GameObject;
    public iconCharge: Image;

    @Header("Hunter")
    @SerializeField() private catchedText: ZepetoText;

    Awake() {
        if (UIManager.instance != null) GameObject.Destroy(this.gameObject);
        else UIManager.instance = this;
    }

    ShowIconPercentage(show: bool, pointerPos: Vector3) {
        if (show != this.icon.activeSelf) this.icon.SetActive(show);
        this.icon.transform.position = pointerPos;
    }

    UpdateChargeFillAmount(percentage: number) {
        this.iconCharge.fillAmount = percentage;
    }

    ShowCatchedText() {
        this.StartCoroutine(this.ShowCatchedTextCoroutine());
    }

    *ShowCatchedTextCoroutine() {
        this.catchedText.gameObject.SetActive(true);
        yield new WaitForSeconds(1);
        this.catchedText.gameObject.SetActive(false);
    }
}