import { Bounds, Collider, Color, GameObject, Gizmos, Input, KeyCode, Mathf, Physics, Quaternion, Random, Transform, Vector3 } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import GameManager from './GameManager';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';

// This class controls the spawn of the players
export default class RandomSpawner extends ZepetoScriptBehaviour {
    public static instance: RandomSpawner; // Singleton variable

    @SerializeField() spawnSizeX: number = 3; // Size of X for the area to spawn
    @SerializeField() spawnSizeZ: number = 3; // Size of Z for the area to spawn

    private spawnSize: Vector3 = Vector3.zero; // Size of the bounds that will be created

    @SerializeField() private spawnpoints: Transform[] = []; // List of the spawnpoints

    private spawnAreas: Bounds[] = []; // List of bounds to spawn players

    Awake() {
        //Singleton pattern
        if (RandomSpawner.instance) GameObject.Destroy(this.gameObject);
        else RandomSpawner.instance = this;

        // Set the spawn size
        this.spawnSize = new Vector3(this.spawnSizeX, 0, this.spawnSizeZ);
    }

    Start() {
        // For each spawn point creates a bound and save it into the array
        this.spawnpoints.forEach(spawn => {
            let bound = new Bounds(spawn.position, this.spawnSize);
            this.spawnAreas.push(bound);
        });

        // When added the local player
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            // Send the local player to a random position
            this.GetRandomSpawnPos();
        });
    }

    GetRandomSpawnPos(): Vector3 {
        // Get a random number between 0 and the spawpoints
        let rnd = Mathf.RoundToInt(Random.Range(0, this.spawnpoints.length - 1));

        let sizeX = this.spawnAreas[rnd].size.x / 2;
        let sizeZ = this.spawnAreas[rnd].size.z / 2;
        // Get a random position inside the bound
        let rndX = Mathf.RoundToInt(Random.Range(-sizeX, sizeX));
        let rndZ = Mathf.RoundToInt(Random.Range(-sizeZ, sizeZ));

        // Save a reference of the spawn point selected
        let spawnPos = new Vector3(this.spawnAreas[rnd].center.x + rndX, 0, this.spawnAreas[rnd].center.z + rndZ);

        // Get a list of colliders inside a little sphere with the layers of players
        let colls: Collider[] = Physics.OverlapSphere(spawnPos, 0.25, GameManager.instance.playerLayer.value);

        // Check if there are other players near to the spawn position
        if (colls.length > 0) {
            // Send to another position
            console.log("COLLS: " + colls.length);

            // this.SendToRandomPosition(obj);
        } else {
            // Set in this position
            return spawnPos;
        }
    }

    OnDrawGizmos() {
        Gizmos.color = Color.blue;
        this.spawnAreas.forEach(area => {
            Gizmos.DrawWireCube(area.center, area.size);
        });
    }
}