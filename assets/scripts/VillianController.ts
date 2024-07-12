import {
  _decorator,
  Animation,
  AnimationClip,
  Component,
  MeshRenderer,
  Node,
  Texture2D,
} from "cc";
import { VillianAnimationNames } from "./Constants";
const { ccclass, property } = _decorator;

@ccclass("VillianController")
export class VillianController extends Component {
  @property({ type: Node }) villianBodyNode: Node | null = null;
  @property({ type: Node }) villianBody: Node | null = null;
  @property({ type: Texture2D }) villianBodyColor: Texture2D | null = null;

  public victoryTimeout: number | null = null;
  private animationComponent: Animation | null = null;

  onLoad() {
    this.villianBody
      .getComponent(MeshRenderer)
      .material.setProperty("albedoMap", this.villianBodyColor);

    this.animationComponent = this.villianBodyNode.getComponent(Animation);
    this.animationComponent.clips[0].name = VillianAnimationNames.IDLE;
    this.animationComponent.clips[1].name = VillianAnimationNames.KILL;
    this.animationComponent.clips[2].name = VillianAnimationNames.DIE;
    this.animationComponent.clips[3].name = VillianAnimationNames.ROAR;
    this.animationComponent.clips[4].name = VillianAnimationNames.VICTORY;
  }

  start() {
    this.playIdleAnimation();
  }

  playIdleAnimation() {
    this.animationComponent = this.villianBodyNode.getComponent(Animation);
    this.animationComponent.crossFade(VillianAnimationNames.IDLE, 0.6);
  }

  playVictoryAnimation() {
    this.animationComponent = this.villianBodyNode.getComponent(Animation);
    this.animationComponent.crossFade(VillianAnimationNames.VICTORY, 0.85);
  }

  playKillingAnimation() {
    this.animationComponent = this.villianBodyNode.getComponent(Animation);
    this.animationComponent.crossFade(VillianAnimationNames.KILL, 0.7);
    this.animationComponent.getState(VillianAnimationNames.KILL).speed = 1.5;
  }

  playRoarAnimation() {
    this.animationComponent = this.villianBodyNode.getComponent(Animation);
    this.animationComponent.getState(VillianAnimationNames.ROAR).wrapMode =
      AnimationClip.WrapMode.Normal;
    this.animationComponent.crossFade(VillianAnimationNames.ROAR, 0.4);
    this.victoryTimeout = setTimeout(() => {
      this.playVictoryAnimation();
    }, 6000);
  }

  playDieAnimation() {
    this.animationComponent = this.villianBodyNode.getComponent(Animation);
    this.animationComponent.getState(VillianAnimationNames.DIE).wrapMode =
      AnimationClip.WrapMode.Normal;
    this.animationComponent.crossFade(VillianAnimationNames.DIE, 0.5);
  }

  update(deltaTime: number) {}
}
