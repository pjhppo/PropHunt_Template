import { Debug, GameObject, Rect, Sprite, Texture, Texture2D, Transform, Vector2 } from 'UnityEngine';
import { Image } from 'UnityEngine.UI';
import { ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldHelper, Users } from 'ZEPETO.World';

export default class ThumbnailsCreator extends ZepetoScriptBehaviour {
    @SerializeField() thumbnailPrefab: GameObject;
    @SerializeField() thumbnailParent: Transform;

    public playerThumbs: PlayerThumb[] = [];

    public GetPlayerThumb(userId: string): Sprite {
        let thumbToReturn: Sprite = null;
        this.playerThumbs.forEach(thumb => {
            if (thumb.userId == userId) thumbToReturn = thumb.thumbSprite;
        });
        return thumbToReturn;
    }

    Start() {
        this.CreateNewThumbnail();
    }

    CreateNewThumbnail() {
        ZepetoPlayers.instance.OnAddedPlayer.AddListener((playerAdded) => {
            const player = ZepetoPlayers.instance.GetPlayer(playerAdded);
            // Debug.LogError("Player getted: " + player.userId);
            if (!player) return;
            // Debug.LogError("Creating thumbnail");
            const userId = player.userId;
            this.GetProfileTexture(userId);
        });
    }

    GetSprite(texture: Texture) {
        let rect: Rect = new Rect(0, 0, texture.width, texture.height);
        return Sprite.Create(texture as Texture2D, rect, new Vector2(0.5, 0.5));
    }

    GetProfileTexture(userId: string) {
        ZepetoWorldHelper.GetProfileTexture(userId, (texture: Texture) => {
            // Debug.LogError("Thumbnail obtained");
            const sprite = this.GetSprite(texture);
            const newThumbnail: GameObject = GameObject.Instantiate(this.thumbnailPrefab, this.thumbnailParent) as GameObject;
            const thumbImage: Image = newThumbnail.GetComponent<Image>();
            thumbImage.sprite = sprite;

            const newPlayerThumb = new PlayerThumb();
            newPlayerThumb.userId = userId;
            newPlayerThumb.thumbSprite = sprite;
            newPlayerThumb.thumbTexture = texture;
            newPlayerThumb.thumbPrefab = newThumbnail;

            this.playerThumbs.push(newPlayerThumb);

            //Debug.LogError("PlayerThumb added \n UserId: " + newPlayerThumb.userId + "\n thumbPrefab: " + newPlayerThumb.thumbPrefab.name + "\n isHunter: " + newPlayerThumb.isHunter);
        }, (error) => {
            console.log(error);
        });
        return null;
    }
}

export class PlayerThumb {
    public userId: string;
    public thumbPrefab: GameObject;
    public thumbSprite: Sprite;
    public thumbTexture: Texture;
}