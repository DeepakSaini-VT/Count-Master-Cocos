import { _decorator, Animation, Component, Node, randomRange, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("KnifeGround")
export class KnifeGround extends Component {
  @property({ type: Node }) knife: Node | null = null;
  @property({ type: Node }) knifeParent: Node | null = null;

  start() {
    const rotation = Math.random() > 0.5 ? -180 : 0;
    this.node.setRotationFromEuler(new Vec3(0, rotation, 0));

    this.playRandomTimeLapsedAnimation();
  }

  playRandomTimeLapsedAnimation() {
    this.knifeParent.getComponent(Animation).getState("obstacles").speed =
      randomRange(0.6, 1.3);
  }

  update(deltaTime: number) {}
}
