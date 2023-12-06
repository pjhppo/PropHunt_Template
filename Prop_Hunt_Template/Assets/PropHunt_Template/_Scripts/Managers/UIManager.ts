import { Coroutine, Debug, GameObject, Mathf, Screen, Time, Transform, Vector3, WaitForSeconds, WaitUntil } from 'UnityEngine';
import { Button, Image, Slider } from 'UnityEngine.UI';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoText } from 'ZEPETO.World.Gui';
import UIPlayerListTemplate from '../UI/UIPlayerListTemplate';
import MultiplayerPropHuntManager, { PlayerDataModel } from '../Multiplayer/MultiplayerPropHuntManager';
import WinnerScreen from '../UI/WinnerScreen';
import LobbyElementPool from '../UI/LobbyElementPool';
import { RectTransform } from 'UnityEngine';
import UITransformableButton from '../UI/UITransformableButton';

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
    private showingProps: bool = false;

    @Header("Hunter") // hunters section
    @SerializeField() private hunterCanvas: GameObject; // Reference to the hunter canvas
    @SerializeField() private huntersBlackoutScreen: GameObject; // Reference to the black out screen
    @SerializeField() private catchedText: ZepetoText; // Reference to the text that shows when catch someone

    @Header("General")
    @SerializeField() private winnerScreen: GameObject; // Reference to the winner screen GO

    @SerializeField() private txtPropsCounter: ZepetoText;
    @HideInInspector() public propsAmount: number = 0;

    public txtPropCounter: ZepetoText;
    public txtHunterCounter: ZepetoText;
    public propsCounter: number = 0;
    public huntersCounter: number = 0;

    private rectPropList: RectTransform;
    private limitOut: Vector3;
    private limitIn: Vector3;

    private showingCoroutine: Coroutine;

    @NonSerialized() public buttonSelected: UITransformableButton;

    public lobbyElementPool: GameObject; // Reference to the element that shows on the lobby
    private _lobbyElementPool: LobbyElementPool; // Reference to the script of the lobby pool

    Awake() {
        // Singleton pattern
        if (UIManager.instance != null) GameObject.Destroy(this.gameObject);
        else UIManager.instance = this;

        // Get the reference of the script of the lobby element
        this._lobbyElementPool = this.lobbyElementPool.GetComponent<LobbyElementPool>();

        this.btnpropList.onClick.AddListener(() => {
            this.showingProps = !this.showingProps;
            if (this.showingCoroutine) this.StopCoroutine(this.showingCoroutine);
            this.showingCoroutine = this.StartCoroutine(this.ShowPropListCoroutine(this.showingProps));
        });

        // Update the texts of the counters in the lobby to be 0
        this.txtHunterCounter.text = this.huntersCounter.toString();
        this.txtPropCounter.text = this.propsCounter.toString();

        // Get the reference of the rect transform of the proplist
        this.rectPropList = this.propList.GetComponent<RectTransform>();

        this.limitIn = this.rectPropList.position;
        let _limitOut = this.rectPropList.position;
        _limitOut.x = Screen.width;
        this.limitOut = _limitOut;
    }

    // This functions is called when one player is added to the game
    public OnZepetoAddPlayer(sessionId: string) {
        // Get a reference of an element of the pool calling to the function of the script
        let uiElement = this._lobbyElementPool.GetElement();
        // populate the ui element with the data of the new player
        uiElement.GetComponent<UIPlayerListTemplate>().Populate(sessionId, false, true);
    }

    // This functions is called when someone leaves the game
    public OnZepetoRemovePlayer(sessionId: string) {
        // Call to the function of the lobby pool passing the player that leaves
        this._lobbyElementPool.ReturnElementById(sessionId);
    }

    public SetPropSelectedButton(btnScript: UITransformableButton) {
        if (this.buttonSelected) this.buttonSelected.selected.SetActive(false);
        this.buttonSelected = btnScript;
    }

    public ResetPropSelectedButton() {
        if (this.buttonSelected) this.buttonSelected.SetDefault();
        this.buttonSelected = null;
    }

    // This function updates the lobby info 
    public RefreshLobby() {
        // For each player data in the multiplayer manager
        MultiplayerPropHuntManager.instance.playersData.forEach(PlayerData => {
            // For each pool element in the pool list
            this._lobbyElementPool.GetActiveList().forEach(poolElement => {
                let poolElementScript = poolElement.GetComponent<UIPlayerListTemplate>();
                // Check if the session id of the player is equal to the  pool element
                if (PlayerData.sessionId == poolElementScript.GetUser()) {
                    let teamChanged = PlayerData.isHunter != poolElementScript._isHunter;
                    // Then populate the pool element with the player data
                    poolElement.GetComponent<UIPlayerListTemplate>().Populate(PlayerData.sessionId, teamChanged);
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

    // Coroutine to show the prop list
    *ShowPropListCoroutine(show: bool) {
        // Set the variables
        let counter: number = 0;
        let maxCounter: number = 0.15;
        let width: number = this.rectPropList.sizeDelta.x;

        // Set the start and final positions
        let startingPos: Vector3 = this.rectPropList.position;
        let finalPos: Vector3;

        // Move to the right or the left
        if (show) finalPos = this.limitIn;
        else finalPos = this.limitOut;

        // Loop
        while (true) {
            yield null;
            // Add the time to the counter
            counter += Time.deltaTime;

            // Save the percentage of the movement
            let percentage: number = counter / maxCounter;
            // Get the new position by the percentage
            let newPosition: Vector3 = Vector3.Lerp(startingPos, finalPos, percentage);
            // Set the rect position to the new position
            this.rectPropList.position = newPosition;
            // Check if the counter is greater than the max counter stop the loop
            if (counter > maxCounter) return;
        }
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

    // This functions updates the counters on the lobby
    UpdateCountersInLobby(isHunter: bool) {
        // Check if the new one is hunter and then add one or rest one 
        if (isHunter) {
            this.propsCounter--;
            this.huntersCounter++;
        } else {
            this.propsCounter++;
            this.huntersCounter--;
        }

        // Limit the minimal number to zero for the two teams
        this.huntersCounter = this.LimitToZero(this.huntersCounter);
        this.propsCounter = this.LimitToZero(this.propsCounter);


        // Update the texts
        this.txtHunterCounter.text = this.huntersCounter.toString();
        this.txtPropCounter.text = this.propsCounter.toString();
    }

    // This function addd one to the corresponding counter
    AddOneCounterInLobby(isHunter: bool) {
        // Check if the new one is hunter and then add one
        if (isHunter) {
            this.huntersCounter++;
        } else {
            this.propsCounter++;
        }

        // Update the texts
        this.txtHunterCounter.text = this.huntersCounter.toString();
        this.txtPropCounter.text = this.propsCounter.toString();
    }
    private LimitToZero(amount: number): number {
        if (amount < 0) amount = 0;
        return amount;
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