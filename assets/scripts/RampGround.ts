import { _decorator, Component, Node, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("RampGround")
export class RampGround extends Component {
  @property({ type: Node }) ramp: Node | null = null;

  private positions: Vec3[] = [
    new Vec3(-7.5, 0.5, 0.2),
    new Vec3(0, 0.5, 0.2),
    new Vec3(7.5, 0.5, 0.2),
  ];

  start() {
    const rampPosition = this.getRandomPosition(this.positions);
    this.ramp.setPosition(rampPosition);
  }

  getRandomPosition(positions: Vec3[]): Vec3 {
    const randomIndex = Math.floor(Math.random() * positions.length);
    return positions[randomIndex];
  }

  update(deltaTime: number) {}
}
