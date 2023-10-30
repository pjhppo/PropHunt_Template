import { GameObject, Mathf, Transform, Vector3, WaitForSeconds } from 'UnityEngine';
import { Button, Image, Slider } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoText } from 'ZEPETO.World.Gui';
import UIPlayerListTemplate from '../UI/UIPlayerListTemplate';
import MultiplayerPropHuntManager, { PlayerDataModel } from '../Multiplayer/MultiplayerPropHuntManager';
import WinnerScreen from '../UI/WinnerScreen';
import LobbyElementPool from '../UI/LobbyElementPool';
import { ZepetoPlayerControl } from 'ZEPETO.Character.Controller';

// This function is responsible for all the tasks that need to be displayed on the UI
export default class UIManager extends ZepetoScriptBehaviour {
    public static instance: UIManager; // Is used for the singleton pattern

    public icon: GameObject; // Reference to the GO of the charging icon of the hunter
    public iconCharge: Image; // Reference to the Image of the chargin icon of the hunte

    public txtTime: ZepetoText; // Reference to the text that shows the timer
    public teamSelectorObj: GameObject; // Reference to the team selector screen GO

    @SerializeField() huntersParent: Transform; // Reference to the hunters parent
    @SerializeField() nonHuntersParent: Transform; // Reference to the non hunters parent

    @Header("NonHunter") // Non hunters/props section
    @SerializeField() private nonHunterCanvas: GameObject; // Reference to the non hunter canvas
    @SerializeField() private btnpropList: Button; // Reference to the prop list button
    @SerializeField() private propList: GameObject; // Reference to the prop list
    public sliderRot: Slider; // Reference to the slider to rotate the object

    @Header("Hunter") // hunters section
    @SerializeField() private hunterCanvas: GameObject; // Reference to the hunter canvas
    @SerializeField() private huntersBlackoutScreen: GameObject; // Reference to the black out screen
    @SerializeField() private catchedText: ZepetoText; // Reference to the text that shows when catch someone

    @Header("General")
    @SerializeField() private winnerScreen: GameObject; // Reference to the winner screen GO

    @SerializeField() private txtPropsCounter: ZepetoText;
    @HideInInspector() public propsAmount: number = 0;

    public lobbyElementPool: GameObject; // Reference to the element that shows on the lobby
    private _lobbyElementPool: LobbyElementPool; // Reference to the script of the lobby pool

    Awake() {
        // Singleton pattern
        if (UIManager.instance != null) GameObject.Destroy(this.gameObject);
        else UIManager.instance = this;

        // Get the reference of the script of the lobby element
        this._lobbyElementPool = this.lobbyElementPool.GetComponent<LobbyElementPool>();

        this.btnpropList.onClick.AddListener(()=>{
            this.propList.SetActive(!this.propList.activeSelf);
        });
    }

    // This functions is called when one player is added to the game
    public OnZepetoAddPlayer(sessionId: string) {
        // Get a reference of an element of the pool calling to the function of the script
        let uiElement = this._lobbyElementPool.GetElement();
        // populate the ui element with the data of the new player
        uiElement.GetComponent<UIPlayerListTemplate>().Populate(sessionId);
    }

    // This functions is called when someone leaves the game
    public OnZepetoRemovePlayer(sessionId: string) {
        // Call to the function of the lobby pool passing the player that leaves
        this._lobbyElementPool.ReturnElementById(sessionId);
    }

    // This function updates the lobby info 
    public RefreshLobby() {
        // For each player data in the multiplayer manager
        MultiplayerPropHuntManager.instance.playersData.forEach(PlayerData => {
            // For each pool element in the pool list
            this._lobbyElementPool.GetActiveList().forEach(poolElement => {
                // Check if the session id of the player is equal to the  pool element
                if (PlayerData.sessionId == poolElement.GetComponent<UIPlayerListTemplate>().GetUser()) {
                    // Then populate the pool element with the player data
                    poolElement.GetComponent<UIPlayerListTemplate>().Populate(PlayerData.sessionId);
                }
            });
        });
    }

    // This function updates the txt of the props amount receiving the actual amount by parameter
    UpdatePropsCounter(amount: number) {
        this.txtPropsCounter.text = amount.toString() + "/" + this.propsAmount.toString();
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

    // This functions updates the fill amount of the charging icon image
    UpdateChargeFillAmount(percentage: number) {
        this.iconCharge.fillAmount = percentage;
    }

    // This function shows or hide the icon of the charging image and position it by parameters
    ShowIconPercentage(show: bool, pointerPos: Vector3) {
        // Activate the icon by the passed parameter
        this.icon.SetActive(show);
        // Positioning the icon by the parameter
        this.icon.transform.position = pointerPos;
    }

    // This function shows the catched text for the hunter
    ShowCatchedText() {
        // Call to start a coroutine to show the text
        this.StartCoroutine(this.ShowCatchedTextCoroutine());
    }

    // Coroutine to show the catched text 
    *ShowCatchedTextCoroutine() {
        // Active the text
        this.catchedText.gameObject.SetActive(true);
        // Wait 1 second
        yield new WaitForSeconds(1);
        // Deactivate the text
        this.catchedText.gameObject.SetActive(false);
    }

    // This function switchs the canvas showed for the player
    SwitchGameUI(isHunter: boolean = false) {
        // If is not hunter then activate the non hunter canvas
        this.nonHunterCanvas.SetActive(!isHunter);
        // If is hunter activate the hunter canvas
        this.hunterCanvas.SetActive(isHunter);
    }

    // This function shows the blackout screen by a parameter
    ShowBlackoutScreen(value: boolean) {
        this.huntersBlackoutScreen.SetActive(value);
    }

    // This function shows the winner screen by a parameter
    ShowWinScreen(huntersWins: boolean) {
        // Get the component WinnerScreen from the go saved and call to the function SetWinner sending the parameter
        let winnerScript = this.winnerScreen.GetComponent<WinnerScreen>();
        winnerScript.SetWinner(huntersWins);
    }

    // This function hides the winner screen
    HideWinnerScreen() {
        this.propsAmount = 0;
        this.winnerScreen.SetActive(false);
    }

    // This function returns the hunter parent variable
    public GetLobbyHunterParent(): Transform {
        return this.huntersParent;
    }

    // This function returns the non hunter parent variable
    public GetLobbyNonHunterParent(): Transform {
        return this.nonHuntersParent;
    }
}