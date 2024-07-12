import { _decorator, Component, instantiate, Node, Prefab } from "cc";
import { GAME_END_TYPE, PrefabObj } from "./Constants";
const { ccclass, property } = _decorator;

@ccclass("Level")
export class Level extends Component {
  @property({ type: Prefab }) simpleGroundPrefab: Prefab | null = null;
  @property({ type: Prefab }) choosingGroundPrefab: Prefab | null = null;
  @property({ type: Prefab }) hammerGroundPrefab: Prefab | null = null;
  @property({ type: Prefab }) knifeGroundPrefab: Prefab | null = null;
  @property({ type: Prefab }) rampGroundPrefab: Prefab | null = null;
  @property({ type: Prefab }) sawGround: Prefab | null = null;
  @property({ type: [Prefab] }) finishLines: Prefab[] | [] = [];

  public finishLineNode: Node | null = null;
  public gameEndType: number | null = null;
  public gameEndPoint: number | null = null;

  private levelBlocks: number = 10;
  private groundPrefabsArray: PrefabObj[] | [] = [];
  private groundNodesArray: Node[] = [];

  start() {
    this.groundPrefabsArray = [
      { prefab: this.simpleGroundPrefab, weight: 20 },
      // { prefab: this.choosingGroundPrefab, weight: 10 },
      { prefab: this.hammerGroundPrefab, weight: 10 },
      { prefab: this.knifeGroundPrefab, weight: 10 },
      { prefab: this.rampGroundPrefab, weight: 25 },
      { prefab: this.sawGround, weight: 20 },
    ];

    this.setupPath();
  }

  getRandomGroundPrefab(prefabs: PrefabObj[]): Prefab {
    // Create a weighted array
    const weightedArray = [];
    for (let i = 0; i < prefabs.length; i++) {
      for (let j = 0; j < prefabs[i].weight; j++) {
        weightedArray.push(prefabs[i].prefab);
      }
    }

    // Get a random index from the weighted array
    const randomIndex = Math.floor(Math.random() * weightedArray.length);
    return weightedArray[randomIndex];
  }

  getRandomPrefab(grounds: Prefab[]): Prefab {
    const randomIndex = Math.floor(Math.random() * grounds.length);
    return grounds[randomIndex];
  }

  destroyLevel() {
    this.node.destroyAllChildren();
  }

  setupPath() {
    const previousGround = instantiate(this.simpleGroundPrefab);
    this.node.addChild(previousGround);
    this.groundNodesArray.push(previousGround);
    previousGround.setPosition(0, 0, 25);

    for (let i = 0; i < 2; i++) {
      const startingGround = instantiate(this.simpleGroundPrefab);
      this.node.addChild(startingGround);
      this.groundNodesArray.push(startingGround);
      startingGround.setPosition(0, 0, -i * 25);
    }
    for (let i = 0; i < this.levelBlocks; i++) {
      const blockPrefab = this.getRandomGroundPrefab(this.groundPrefabsArray);
      const block = instantiate(blockPrefab);
      this.node.addChild(block);
      this.groundNodesArray.push(block);
      block.setPosition(0, 0, -(i + 2) * 25);
    }

    this.finishLineNode = instantiate(
      this.finishLines[Math.random() > 0.5 ? 0 : 1]
    );
    switch (this.finishLineNode.name) {
      case "EnemyFinishLine":
        this.gameEndType = GAME_END_TYPE.VILLIAN_ENDING;
        break;
      case "FinishLine":
        this.gameEndType = GAME_END_TYPE.RACE_ENDING;
        break;
    }
    this.node.addChild(this.finishLineNode);
    this.groundNodesArray.push(this.finishLineNode);
    this.finishLineNode.setPosition(0, 0, -(this.levelBlocks + 3) * 25);
    this.gameEndPoint = -(this.levelBlocks + 3) * 25;
  }

  update(deltaTime: number) {}
}
