import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("FinishLine")
export class FinishLine extends Component {
  @property({ type: Node }) endVillian: Node | null = null;

  start() {}

  update(deltaTime: number) {}
}
