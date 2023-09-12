import { forEachChild } from 'typescript';
import { Debug, GameObject, Mathf, Object, Transform, Vector3, WaitForSeconds } from 'UnityEngine';
import { Image, Slider } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoText } from 'ZEPETO.World.Gui';
import GameManager from './GameManager';
import UIPlayerListTemplate from '../UI/UIPlayerListTemplate';
import MultiplayerPropHuntManager, { PlayerDataModel } from '../Multiplayer/MultiplayerPropHuntManager';
import WinnerScreen from '../UI/WinnerScreen';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';

export default class UIManager extends ZepetoScriptBehaviour {
    public static instance: UIManager;

    public iconImagePrefab: GameObject;

    public icon: GameObject;
    public iconCharge: Image;

    public txtTime: ZepetoText;
    public teamSelectorObj: GameObject;
    public uiTeamLayoutPrefab: GameObject;

    @SerializeField() huntersParent: Transform;
    @SerializeField() nonHuntersParent: Transform;

    @Header("NonHunter")
    @SerializeField() private nonHunterCanvas: GameObject;
    public sliderRot: Slider;

    @Header("Hunter")
    @SerializeField() private hunterCanvas: GameObject;
    @SerializeField() private huntersBlackoutScreen: GameObject;
    @SerializeField() private catchedText: ZepetoText;

    @Header("General")
    @SerializeField() private winnerScreen: GameObject;
    private _uiPlayerList: UIPlayerListTemplate[] = [];


    Awake() {
        if (UIManager.instance != null) GameObject.Destroy(this.gameObject);
        else UIManager.instance = this;

        this._uiPlayerList = [];
    }

    OnZepetoAddPlayer()
    {
        this._uiPlayerList.forEach(element => {
            Object.Destroy(element, 1);
        });

        this._uiPlayerList = [];

        MultiplayerPropHuntManager.instance.playersData.forEach(element => {
            this.CreateTeamMember(element);
        });
    }

    public RefreshLobby()
    {
        MultiplayerPropHuntManager.instance.playersData.forEach(element => {
            let uiPlayerElement = this.GetUiPlayerElement(element.sessionId);
            if (element.isHunter) {
                uiPlayerElement.GetComponent<UIPlayerListTemplate>().ChangeParent(this.huntersParent);
            }
            else {
                uiPlayerElement.GetComponent<UIPlayerListTemplate>().ChangeParent(this.nonHuntersParent);
            }
            uiPlayerElement.GetComponent<UIPlayerListTemplate>().SetReady(element.isReady);
        });
    }

    public GetUiPlayerElement(sessionId: string): UIPlayerListTemplate
    {
        let result = this._uiPlayerList[0];
        this._uiPlayerList.forEach(element => {
            if(element.name == sessionId)
            {
                result = element;   
            }
        });
        return result;
    }

    CreateTeamMember(playerDataModel: PlayerDataModel) 
    {
        let uiPlayerList: UIPlayerListTemplate = GameObject.Instantiate(this.uiTeamLayoutPrefab, this.nonHuntersParent) as UIPlayerListTemplate;
        uiPlayerList.name = playerDataModel.sessionId;
        uiPlayerList.GetComponent<UIPlayerListTemplate>().SetDisplayName(ZepetoPlayers.instance.GetPlayer(playerDataModel.sessionId).name);
        this._uiPlayerList.push(uiPlayerList);
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

    SwitchGameUI(isHunter: boolean = false){
        this.nonHunterCanvas.SetActive(!isHunter);
        this.hunterCanvas.SetActive(isHunter);
    }

    SwitchSpectateScreen(playerName: string)
    {
        
    }

    ShowBlackoutScreen(value: boolean){
        this.huntersBlackoutScreen.SetActive(value);
    }
    
    ShowWinScreen(huntersWins: boolean){
        this.winnerScreen.GetComponent<WinnerScreen>().SetWinner(huntersWins);
    }

}