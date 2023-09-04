import { GameObject, Mathf, Transform, Vector3, WaitForSeconds } from 'UnityEngine';
import { Image, Slider } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoText } from 'ZEPETO.World.Gui';
import UIPlayerListTemplate from '../UI/UIPlayerListTemplate';

export default class UIManager extends ZepetoScriptBehaviour {
    public static instance: UIManager;

    public iconImagePrefab: GameObject;

    public icon: GameObject;
    public iconCharge: Image;

    public txtTime: ZepetoText;
    public teamSelectorObj: GameObject;
    public uiTeamLayoutPrefab: GameObject;
    private _hunterTeamList: UIPlayerListTemplate[];
    private _propTeamList: UIPlayerListTemplate[];

    @SerializeField() huntersParent: Transform;
    @SerializeField() nonHuntersParent: Transform;

    @Header("NonHunter")
    @SerializeField() private nonHunterCanvas: GameObject;
    public sliderRot: Slider;

    @Header("Hunter")
    @SerializeField() private hunterCanvas: GameObject;
    @SerializeField() private catchedText: ZepetoText;

    Awake() {
        if (UIManager.instance != null) GameObject.Destroy(this.gameObject);
        else UIManager.instance = this;

        this._hunterTeamList = [];
        this._propTeamList = [];
    }

    CreateTeamMember(isHunter: bool, user: string) {
        if (isHunter) {
            let uiPlayerList: UIPlayerListTemplate = GameObject.Instantiate(this.uiTeamLayoutPrefab, this.huntersParent) as UIPlayerListTemplate;
            uiPlayerList.SetText(user);
            this._hunterTeamList.push(uiPlayerList);
        } else {
            let uiPlayerList: UIPlayerListTemplate = GameObject.Instantiate(this.uiTeamLayoutPrefab, this.nonHuntersParent) as UIPlayerListTemplate;
            uiPlayerList.SetText(user);
            this._propTeamList.push(uiPlayerList);
        }
    }

    ChangeTeam(userId: string, isHunter: bool) {
        if (isHunter) {
            // userId.transform.parent = this.huntersParent;
        } else {
            // userId.transform.parent = this.nonHuntersParent;
        }
    }

    // This method controls the visual of the timer, normalizing the time to mins and secs
    UpdateTimeRemaining(timeRemaining: number) {
        // We round the value of the minutes
        let tempMin: number = Mathf.FloorToInt(timeRemaining / 60);

        // We round the value of the seconds
        let tempSeg: number = Mathf.RoundToInt(timeRemaining % 60);

        // We create a text variable for the minutes
        let tempMinString: string = tempMin <= 0 ? " " : tempMin.toString() + " : ";

        // We create a text variable for the seconds
        let tempSegString: string = tempSeg < 10 ? "0" + tempSeg : tempSeg.toString();

        // We update the "remaininTxt" text to a text string consisting of "tempMinString" and "tempSegString"
        this.txtTime.text = tempMinString + tempSegString;
    }

    UpdateChargeFillAmount(percentage: number) {
        this.iconCharge.fillAmount = percentage;
    }

    ShowIconPercentage(show: bool, pointerPos: Vector3) {
        if (show != this.icon.activeSelf) this.icon.SetActive(show);
        this.icon.transform.position = pointerPos;
    }

    ShowCatchedText() {
        this.StartCoroutine(this.ShowCatchedTextCoroutine());
    }

    *ShowCatchedTextCoroutine() {
        this.catchedText.gameObject.SetActive(true);
        yield new WaitForSeconds(1);
        this.catchedText.gameObject.SetActive(false);
    }

    ShowNonHunterUI(show: bool = true) {
        this.nonHunterCanvas.SetActive(show);
    }

    ShowHunterUI(show: bool = true) {
        this.hunterCanvas.SetActive(show);
    }

}