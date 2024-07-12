import {
  _decorator,
  Component,
  instantiate,
  Node,
  Prefab,
  randomRange,
  tween,
  Vec3,
} from "cc";
import { CharacterController } from "./CharacterController";
import { GameplayManager } from "./GameplayManager";
const { ccclass, property } = _decorator;

@ccclass("CharactersManager")
export class CharactersManager extends Component {
  @property({ type: Prefab }) character: Prefab | null = null;
  @property({ type: Prefab }) splashedCharacter: Prefab | null = null;

  @property({ type: Node }) splashCharactersNode: Node | null = null;
  @property({ type: Node }) startBtn: Node | null = null;
  @property({ type: Node }) camera: Node | null = null;
  @property({ type: Node }) canvas: Node | null = null;
  @property({ type: Node }) level: Node | null = null;

  public characterPositions: Vec3[] = [];
  public endGameVillian: Node | null = null;
  public removeCharacterTimeout: number[] = [];

  private startingCharacters: number = 25;
  private gridSize: number | null = null;
  private movementSpeed: number = 2;

  initialSetup() {
    for (let i = 0; i < this.startingCharacters; i++) {
      this.addNewCharacter();
    }
    this.removeCharacterTimeout.length = 0;
    this.rePositionCharacters();
  }

  addNewCharacter() {
    const character = instantiate(this.character);
    this.node.addChild(character);
    this.gridSize = this.calculateGridSize(this.node.children.length);
    if (this.canvas.getComponent(GameplayManager).gameStarted) {
      character.getComponent(CharacterController).playRunAnimation();
    } else {
      character.getComponent(CharacterController).playIdleAnimation();
    }
  }

  calculateGridSize(totalNodes: number): number {
    let n = Math.ceil(Math.sqrt(totalNodes));
    return 2 * n - 1;
  }

  rePositionCharacters() {
    let numChildren = this.node.children.length;
    const numRows = this.gridSize;
    const rowOffset = 1;
    const colOffset = 1.5;
    let childIndex = 0;
    const startX = -((numRows - 1) * colOffset) / 2;
    const startZ = ((numRows - 1) * rowOffset) / 2;
    for (let row = 0; row < numRows; row++) {
      const numCols = numRows / 2 - Math.abs(row - (numRows - 1) / 2);
      const xOffset =
        startX + (Math.abs(row - (numRows - 1) / 2) * colOffset) / 2;
      for (let col = 0; col < numCols; col++) {
        if (childIndex >= numChildren) break;
        const childNode = this.node.children[childIndex];
        const xPos = xOffset + col * colOffset;
        const zPos = startZ - row * rowOffset;

        childNode.setPosition(
          randomRange(-0.5, 0.5) + xPos,
          0.55,
          randomRange(-0.25, 0.25) + zPos
        );

        childIndex++;
      }
    }

    this.centerPositions();
  }

  centerPositions() {
    let minimumXPosition = 0;
    for (let i = 0; i < this.node.children.length; i++) {
      if (this.node.children[i].getPosition().x < minimumXPosition) {
        minimumXPosition = this.node.children[i].getPosition().x;
      }
    }

    const positionToMove = -minimumXPosition / 2;

    for (let i = 0; i < this.node.children.length; i++) {
      const currentCharacterPosition = this.node.children[i].getPosition();
      const newPosition = currentCharacterPosition.x + positionToMove;
      this.node.children[i].setPosition(
        newPosition,
        currentCharacterPosition.y,
        currentCharacterPosition.z
      );
      this.characterPositions.push(this.node.children[i].getPosition());
    }
  }

  removeAllCharacters() {
    this.node.removeAllChildren();
    this.splashCharactersNode.removeAllChildren();
  }

  removeCharacter(character: Node, duration: number = 0.25) {
    const characterUUID = character.uuid;
    let characterToBeRemoved = null;
    for (let i = 0; i < this.node.children.length; i++) {
      if (this.node.children[i].uuid === characterUUID) {
        characterToBeRemoved = this.node.children[i];
        break;
      }
    }

    if (characterToBeRemoved) {
      tween(characterToBeRemoved)
        .to(
          duration,
          {
            scale: new Vec3(
              characterToBeRemoved.getScale().x,
              0,
              characterToBeRemoved.getScale().z
            ),
          },
          { easing: "smooth" }
        )
        .call(() => {
          const nodeToRemove = characterToBeRemoved;
          const currentPositon = nodeToRemove.getWorldPosition();
          nodeToRemove.destroy();
          this.setupSplash(currentPositon);
        })
        .start();
    }
  }

  setupSplash(currentPositon: Vec3) {
    const splash = instantiate(this.splashedCharacter);
    splash.setWorldPosition(currentPositon);
    this.splashCharactersNode.addChild(splash);
  }

  playDanceAnimations() {
    const dance = Math.random() > 0.5 ? "DANCE_1" : "DANCE_2";
    for (let i = 0; i < this.node.children.length; i++) {
      if (dance === "DANCE_1") {
        this.node.children[i]
          .getComponent(CharacterController)
          .playDance1Animation();
      } else if (dance === "DANCE_2") {
        this.node.children[i]
          .getComponent(CharacterController)
          .playDance2Animation();
      }
    }
  }

  playDyingAnimation() {
    for (let i = 0; i < this.node.children.length; i++) {
      this.node.children[i]
        .getComponent(CharacterController)
        .playDyingAnimation();
      const dyingTimeout: number = setTimeout(() => {
        this.removeCharacter(this.node.children[i], 1);
      }, 3000);

      this.removeCharacterTimeout.push(dyingTimeout);
    }
  }

  playFightingAnimations() {
    for (let i = 0; i < this.node.children.length; i++) {
      this.node.children[i]
        .getComponent(CharacterController)
        .playFightingAnimation();
    }
  }

  update(deltaTime: number) {
    if (
      this.canvas.getComponent(GameplayManager).gameStarted &&
      !this.canvas.getComponent(GameplayManager).gameEnded &&
      this.node.children.length > 0
    ) {
      const currentPosition = this.node.parent.getPosition().z;

      this.node.parent.setPosition(
        this.node.parent.position.x,
        this.node.parent.position.y,
        currentPosition - (this.movementSpeed / 10) * 75 * deltaTime
      );
    }
  }
}
