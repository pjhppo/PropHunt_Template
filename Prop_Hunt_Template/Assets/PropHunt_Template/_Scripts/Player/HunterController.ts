import { Camera, Collider, Color, Gizmos, LayerMask, Physics, Time, Transform, Vector3 } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import NonHunterController from './NonHunterController';
import UIManager from '../Managers/UIManager';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import GameManager from '../Managers/GameManager';

// This function is responsible for controlling the hunters
export default class HunterController extends ZepetoScriptBehaviour {

    private mainCamera: Camera; // Reference to camera of the player
    private timeToCatch: number; // Saves the time to catch a prop
    private remainingTimeToCatch: number; // Controls the remaining time to catch

    private detectionZone: Vector3; // Saves the position of the detection zone 
    private detectionRadius: number = 0.5; // Set the radius of the detection zone 

    public playerLayer: LayerMask; // Saves the filter layer for the detection zone

    Start() {
        // Get the reference of the zepeto camera
        this.mainCamera = ZepetoPlayers.instance.ZepetoCamera.camera;
        
        // Get the time to catch from the game manager
        this.timeToCatch = GameManager.instance.timeToCatch;
    }

    Update() {
        // Check if the game has started if it is not, stop
        if (!GameManager.gameStarted) return;

        // Save the position for the detection zone calling at the GetForwardPosition function
        let position = this.GetForwardPosition(this.transform);
        // Set the position on the variable for the detection zone
        this.detectionZone = position;
        // Get the colliders getting them from the overlapSpher function
        // https://docs.unity3d.com/ScriptReference/Physics.OverlapSphere.html
        let colls: Collider[] = Physics.OverlapSphere(this.detectionZone, this.detectionRadius, GameManager.instance.playerLayer.value);

        // Check if there are colliders getted
        if (colls.length > 0) {
            // For each collider getted
            colls.forEach(coll => {
                // Get a reference of the non hunter from the collider
                let nonHunter = coll.GetComponent<NonHunterController>();
                // Check if the reference if null if it is, stop
                if (nonHunter == null) return;
                // Call to the function TryCatchNonHuntert
                this.TryCatchNonHunter(nonHunter);
            });
        } else {
            // Call to the function to reset the catch state
            this.ResetCatchingState();
        }
    }

    // This function controls the catch system
    TryCatchNonHunter(nonHunter: NonHunterController) {
        // Get the position of the prop of the world in the screen
        // https://docs.unity3d.com/ScriptReference/Camera.WorldToScreenPoint.html
        let position = this.mainCamera.WorldToScreenPoint(nonHunter.transform.position);
        // Show the icon charging calling at the function in UIManager passing as parameter if you want to show it, and the position to show it
        UIManager.instance.ShowIconPercentage(true, position);
        // Call to the function to update the catch percentage
        this.UpdateCatchPercentage();

        // Check if the remaining time is less than 0
        if (this.remainingTimeToCatch < 0) {
            // Call to the function to catch the hunter
            this.CatchNonHunter(nonHunter);
        }
    }

    // This function do the logic when the nonHunter is catched
    CatchNonHunter(nonHunter: NonHunterController) {
        // Call to the functions to hide te player and set the spectator
        nonHunter.HidePlayer();
        nonHunter.Spectate(this.transform);
        
        // Call to the function to show the catched text in the UIManager
        UIManager.instance.ShowCatchedText();
        // Rest one non hunter of the game calling at the function in the GameManager
        GameManager.instance.RestOneNonHunter();
        // Resets the catching state calling to the function
        this.ResetCatchingState();
    }

    // This function updates the time state when the player is catching someone
    UpdateCatchPercentage() {
        // Rest the real time to the remaining time
        this.remainingTimeToCatch -= Time.deltaTime;
        // Get a percentage of the remaining time
        let timePercentage = this.remainingTimeToCatch / this.timeToCatch;
        // Updates the UI calling at the function in UIManager
        UIManager.instance.UpdateChargeFillAmount(timePercentage);
    }

    // This function resets the catching state of the player
    ResetCatchingState() {
        // Set the remainig time to the total time to catch someone
        this.remainingTimeToCatch = this.timeToCatch;
        // Hide the icon charging calling at the function in the UIManager
        UIManager.instance.ShowIconPercentage(false, Vector3.zero);
    }

    // This function shows ONLY IN EDITOR the catching zone of the hunter by a red sphere
    // Function: https://docs.unity3d.com/ScriptReference/MonoBehaviour.OnDrawGizmos.html
    // Related: https://docs.unity3d.com/ScriptReference/Gizmos.html 
    OnDrawGizmos() {
        // Set the gizmo color to red
        Gizmos.color = Color.red;
        // Creates a gizmo of a wired sphere with the position and radius of the detection zone
        Gizmos.DrawWireSphere(this.detectionZone, this.detectionRadius);
    }

    // This function returns the forward position of an object
    GetForwardPosition(tfPos: Transform): Vector3 {
        let finalPos = tfPos.position;
        finalPos.x += tfPos.forward.x;
        finalPos.y += tfPos.forward.y;
        finalPos.z += tfPos.forward.z;
        return finalPos;
    }
}