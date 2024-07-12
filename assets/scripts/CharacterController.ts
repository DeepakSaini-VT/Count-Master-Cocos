import {
  _decorator,
  Animation,
  AnimationClip,
  BoxCollider,
  Component,
  ITriggerEvent,
  MeshRenderer,
  Node,
  randomRange,
  Texture2D,
  tween,
  Vec3,
} from "cc";
import { CharactersManager } from "./CharactersManager";
import { CharacterAnimationNames } from "./Constants";

const { ccclass, property } = _decorator;

@ccclass("CharacterController")
export class CharacterController extends Component {
  @property({ type: Node }) characterBody: Node | null = null;
  @property({ type: Texture2D }) characterBodyColor: Texture2D | null = null;

  private animationComponent: Animation | null = null;
  private deltaTime: number = 0;

  onLoad() {
    this.characterBody
      .getComponent(MeshRenderer)
      .material.setProperty("albedoMap", this.characterBodyColor);

    this.animationComponent = this.node.getComponent(Animation);
    this.animationComponent.clips[0].name = CharacterAnimationNames.IDLE;
    this.animationComponent.clips[1].name = CharacterAnimationNames.RUN;
    this.animationComponent.clips[2].name = CharacterAnimationNames.DANCE_1;
    this.animationComponent.clips[3].name = CharacterAnimationNames.DANCE_2;
    this.animationComponent.clips[4].name = CharacterAnimationNames.FIGHT;
    this.animationComponent.clips[5].name = CharacterAnimationNames.DIE;

    this.characterBody
      .getComponent(BoxCollider)
      .on("onTriggerEnter", this.onTriggerEnter, this);
  }

  onTriggerEnter(event: ITriggerEvent) {
    const otherColliderName = event.otherCollider.name;

    if (otherColliderName.includes("1 lane ramp")) {
      this.playRampAnimation();
    } else if (otherColliderName.includes("saw")) {
      this.node
        .getParent()
        .getComponent(CharactersManager)
        .removeCharacter(this.node);
    } else if (otherColliderName.includes("knife")) {
      this.node
        .getParent()
        .getComponent(CharactersManager)
        .removeCharacter(this.node);
    } else if (otherColliderName.includes("hammer")) {
      this.node
        .getParent()
        .getComponent(CharactersManager)
        .removeCharacter(this.node);
    } else if (otherColliderName.includes("LeftSide")) {
      this.node.getParent().getComponent(CharactersManager).addNewCharacter();
      this.node
        .getParent()
        .getComponent(CharactersManager)
        .rePositionCharacters();
    } else if (otherColliderName.includes("RightSide")) {
      this.node.getParent().getComponent(CharactersManager).addNewCharacter();
      this.node
        .getParent()
        .getComponent(CharactersManager)
        .rePositionCharacters();
    } else if (otherColliderName.includes("Cone.004")) {
      this.node
        .getParent()
        .getComponent(CharactersManager)
        .removeCharacter(this.node);
    }
  }

  playRampAnimation() {
    tween(this.node)
      .to(
        1,
        {
          position: new Vec3(
            this.node.getPosition().x,
            6,
            this.node.getPosition().z
          ),
        },
        { easing: "smooth" }
      )
      .to(
        0.45,
        {
          position: new Vec3(
            this.node.getPosition().x,
            0.55,
            this.node.getPosition().z
          ),
        },
        { easing: "sineIn" }
      )
      .start();
  }

  onStartBtnClick() {
    this.playRunAnimation();
  }

  playIdleAnimation() {
    this.animationComponent = this.node.getComponent(Animation);
    this.animationComponent.crossFade(CharacterAnimationNames.IDLE, 0.6);
  }

  playRunAnimation() {
    this.animationComponent = this.node.getComponent(Animation);
    this.animationComponent.crossFade(CharacterAnimationNames.RUN, 0.5);
    const animation = this.animationComponent.getState(
      CharacterAnimationNames.RUN
    );
    animation.speed = randomRange(0.8, 1);
  }

  playDance1Animation() {
    this.animationComponent = this.node.getComponent(Animation);
    this.animationComponent.crossFade(CharacterAnimationNames.DANCE_1, 0.6);
  }

  playDance2Animation() {
    this.animationComponent = this.node.getComponent(Animation);
    this.animationComponent.crossFade(CharacterAnimationNames.DANCE_2, 0.6);
  }

  playFightingAnimation() {
    this.animationComponent = this.node.getComponent(Animation);
    this.animationComponent.crossFade(CharacterAnimationNames.FIGHT, 0.7);
  }

  playDyingAnimation() {
    const xPos = randomRange(-10, 10);
    const zPos = randomRange(
      this.node.getPosition().z,
      this.node.getPosition().z + 10
    );
    tween(this.node)
      .to(
        0.7,
        { position: new Vec3(xPos - xPos / 2, 5, zPos - zPos / 2) },
        { easing: "smooth" }
      )
      .to(0.3, { position: new Vec3(xPos, 0.55, zPos) }, { easing: "smooth" })
      .start();

    this.animationComponent = this.node.getComponent(Animation);
    this.animationComponent.getState(CharacterAnimationNames.DIE).wrapMode =
      AnimationClip.WrapMode.Normal;
    this.animationComponent.crossFade(CharacterAnimationNames.DIE, 0.5);
    this.animationComponent.getState(CharacterAnimationNames.DIE).speed = 1.5;
  }

  update(deltaTime: number) {
    this.deltaTime = deltaTime;
  }
}
