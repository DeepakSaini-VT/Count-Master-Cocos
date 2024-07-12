import { _decorator, Component, MeshRenderer, Node, Texture2D } from "cc";
const { ccclass, property } = _decorator;

@ccclass("ChoosingGround")
export class ChoosingGround extends Component {
  @property({ type: Node }) leftSide: Node | null = null;
  @property({ type: Node }) rightSide: Node | null = null;

  @property({ type: Texture2D }) plusOne: Texture2D | null = null;

  start() {
    this.leftSide
      .getComponent(MeshRenderer)
      .material.setProperty("albedoMap", this.plusOne);
    this.rightSide
      .getComponent(MeshRenderer)
      .material.setProperty("albedoMap", this.plusOne);
  }

  update(deltaTime: number) {}
}
