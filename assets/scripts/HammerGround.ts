import { _decorator, Animation, Component, Node, randomRange, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("HammerGround")
export class HammerGround extends Component {
  @property({ type: Node }) hammerParent: Node | null = null;
  @property({ type: Node }) hammer: Node | null = null;

  start() {
    const rotation = Math.random() > 0.5 ? -180 : 0;
    this.node.setRotationFromEuler(new Vec3(0, rotation, 0));

    this.playRandomTimeLapsedAnimation();
  }

  playRandomTimeLapsedAnimation() {
    this.hammerParent.getComponent(Animation).getState("obstacles").speed =
      randomRange(0.5, 1);
  }

  update(deltaTime: number) {}
}
