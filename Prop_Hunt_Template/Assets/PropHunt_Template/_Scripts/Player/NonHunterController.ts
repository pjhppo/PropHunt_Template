import { BoxCollider, GameObject, Mathf, Quaternion, Transform, Vector3 } from 'UnityEngine';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script';
import UIManager from '../Managers/UIManager';
import GameManager from '../Managers/GameManager';
import MultiplayerPropHuntManager, { PlayerDataModel } from '../Multiplayer/MultiplayerPropHuntManager';

// Class representing the controller for non-hunter characters
export default class NonHunterController extends ZepetoScriptBehaviour {
    private playerParent: GameObject; // Reference to the main player object
    private playerChild: Transform; // Reference to the player's child object
    private objectTransformed: GameObject; // Reference to the transformed object

    private spectingNumber: number = 0; // Number used for spectating
    private playerList: PlayerDataModel[] = []; // List of player data

    Start() {
        // Set the main player object
        this.playerParent = this.gameObject;
        // Set the player's child object
        this.playerChild = this.playerParent.transform.GetChild(0);

        let player = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.gameObject;
        // Check if the local player is this character
        if (player == this.playerParent) {
            // Attach an event listener to the rotation slider
            UIManager.instance.sliderRot.onValueChanged.AddListener((value) => {
                this.RotateItem(value);
            });
        }

        // Add the prop to the amount in the UIManager
        UIManager.instance.propsAmount++;

        // Increase the non-hunter count in the game manager
        GameManager.instance.AddOneNonHunter();
    }

    // Transform the character into an item
    TransformIntoItem(itemObj: GameObject) {
        // Hide the player's visual representation
        this.HidePlayer();

        if (itemObj) {
            // Activate the transformed item
            itemObj.SetActive(true);
            // Set the item as a child of the player
            itemObj.transform.SetParent(this.playerParent.transform);

            // Store a reference to the transformed item
            this.objectTransformed = itemObj;

            // Get a reference of the collider of the object
            let coll = this.objectTransformed.GetComponent<BoxCollider>();

            // Adjust the collider size
            coll.size = itemObj.GetComponent<BoxCollider>().size;
        }

        // Save a reference of the playerParent position
        let objPos: Vector3 = this.playerParent.transform.transform.position;
        // Set the item's position to match the player's position
        this.objectTransformed.transform.position = objPos;
    }

    // Transform the character back into a player
    TransformIntoPlayer() {
        // Activate the player object
        this.gameObject.SetActive(true);
        for (let index = 0; index < this.playerChild.childCount; index++) {
            // Activate child objects
            this.playerChild.GetChild(index).gameObject.SetActive(true);
        }

        for (let index = 1; index < this.playerParent.transform.childCount; index++) {
            // Deactivate other children
            this.playerParent.transform.GetChild(index).gameObject.SetActive(false);
        }
    }

    // Hide the player's visual representation
    HidePlayer() {
        for (let index = 0; index < this.playerChild.childCount; index++) {
            // Deactivate child objects
            this.playerChild.GetChild(index).gameObject.SetActive(false);
        }

        for (let index = 1; index < this.playerParent.transform.childCount; index++) {
            // Deactivate other children
            this.playerParent.transform.GetChild(index).gameObject.SetActive(false);
        }
    }

    // Rotate the transformed item
    RotateItem(percentage: number) {
        if (this.objectTransformed != null) {
            // Calculate the rotation
            let rotation: Vector3 = new Vector3(0, Mathf.Lerp(0, 360, percentage), 0);
            // Apply the rotation
            this.playerParent.transform.rotation = Quaternion.Euler(rotation);
        }
    }

    // Spectate a player
    Spectate(spectatePlayer: Transform) {
        // Set the camera to follow the player
        ZepetoPlayers.instance.LocalPlayer.zepetoCamera.SetFollowTarget(spectatePlayer);
    }

    // Switch to the next spectator camera
    NextSpectatorCamera() {
        // Get the player list if not already obtained
        if (!(this.playerList.length > 0)) this.playerList = MultiplayerPropHuntManager.instance.playersData;

        if (this.playerList.length > 1) {
            // Increment the specting number
            this.spectingNumber++;
            // Limit the specting number within the player count
            this.LimitSpectingNumber(this.playerList.length);

            // Get the player to spectate
            let playerToSpect = ZepetoPlayers.instance.GetPlayer(this.playerList[this.spectingNumber].sessionId).character.transform;
            // Start spectating
            this.Spectate(playerToSpect);
        }
    }

    // Switch to the previous spectator camera
    PreviousSpectatorCamera() {
        // Get the player list if not already obtained
        if (!(this.playerList.length > 0)) this.playerList = MultiplayerPropHuntManager.instance.playersData;

        if (this.playerList.length > 1) {
            // Decrement the specting number
            this.spectingNumber--;
            // Limit the specting number within the player count
            this.LimitSpectingNumber(this.playerList.length);

            // Get the player to spectate
            let playerToSpect = ZepetoPlayers.instance.GetPlayer(this.playerList[this.spectingNumber].sessionId).character.transform;
            // Start spectating
            this.Spectate(playerToSpect);
        }
    }

    // Ensure the specting number stays within bounds
    private LimitSpectingNumber(limit: number) {
        // Reset the specting number if it exceeds the limit
        if (this.spectingNumber >= limit) this.spectingNumber = 0;
        // Wrap around if the specting number is negative
        if (this.spectingNumber < 0) this.spectingNumber = limit - 1;
    }

    // Reset the non-hunter character
    ResetNonHunter(isLocal: bool) {
        // Transform the character back into a player
        this.TransformIntoPlayer();
        // Set the camera to follow the local player
        if (isLocal) ZepetoPlayers.instance.LocalPlayer.zepetoCamera.SetFollowTarget(ZepetoPlayers.instance.LocalPlayer.zepetoPlayer.character.transform);
    }
}
