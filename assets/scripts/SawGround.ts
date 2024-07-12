import { _decorator, Component, Node, tween, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("SawGround")
export class SawGround extends Component {
  @property({ type: Node }) rotator: Node | null = null;

  start() {
    this.startRotatingSawAnimation();
  }

  startRotatingSawAnimation() {
    const timeScaleDuration = Math.random() * 5;

    const side = Math.random() > 0.5 ? -7.5 : 7.5;
    const otherSide = side === -7.5 ? 7.5 : -7.5;

    tween(this.rotator)
      .sequence(
        tween().to(timeScaleDuration / 2 > 3 ? timeScaleDuration / 2 : 3, {
          position: new Vec3(side, 0, 0),
        }),
        tween().to(timeScaleDuration / 2 > 3 ? timeScaleDuration / 2 : 3, {
          position: new Vec3(otherSide, 0, 0),
        })
      )
      .repeatForever()
      .start();

    tween(this.rotator)
      .by(timeScaleDuration / 2 > 3 ? timeScaleDuration / 2 : 3, {
        eulerAngles: new Vec3(0, 0, -360),
      })
      .repeatForever()
      .start();
  }

  update(deltaTime: number) {}
}
