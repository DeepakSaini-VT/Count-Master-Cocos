import {
  _decorator,
  Button,
  Component,
  EventTouch,
  input,
  Input,
  Node,
  tween,
  Vec3,
  View,
} from "cc";
import { CharactersManager } from "./CharactersManager";
import { CharacterController } from "./CharacterController";
import { Level } from "./Level";
import { FinishLine } from "./FinishLine";
import { VillianController } from "./VillianController";
import { GAME_END_TYPE } from "./Constants";

const { ccclass, property } = _decorator;

@ccclass("GameplayManager")
export class GameplayManager extends Component {
  @property({ type: Node }) startBtn: Node | null = null;
  @property({ type: Node }) restartBtn: Node | null = null;
  @property({ type: Node }) characters: Node | null = null;
  @property({ type: Node }) level: Node | null = null;
  @property({ type: Node }) camera: Node | null = null;

  public gameStarted: Boolean = false;
  public gameEnded: Boolean = false;

  private endGameTimeouts: number | null = null;
  private moveRange: number = 10;
  private moveCharacters: boolean = false;
  private gameEndType: number | null = null;
  private mouse = new Vec3();
  private tweenWorking: boolean = false;
  start() {
    this.gameStarted = false;
    this.gameEnded = false;
    this.setupInitialCharacters();
    this.setActive(this.restartBtn, false);
    this.setActive(this.startBtn, true);
  }

  setupInitialCharacters() {
    this.characters.getComponent(CharactersManager).initialSetup();
  }

  onStartBtnClick() {
    this.gameStarted = true;
    for (let i = 0; i < this.characters.children.length; i++) {
      const child = this.characters.children[i];
      child.getComponent(CharacterController)?.onStartBtnClick();
    }
    this.setActive(this.startBtn, false);
    this.setActive(this.restartBtn, true);

    input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  onTouchStart(event: EventTouch) {
    this.moveCharacters = true;
    this.mouse.x =
      (event.getUILocation().x / View.instance.getVisibleSize().width - 0.5) *
      2;
    const mappedX = this.mouse.x * this.moveRange;
    this.tweenWorking = true;
    tween(this.characters)
      .to(0.5, {
        position: new Vec3(
          mappedX,
          this.characters.getPosition().y,
          this.characters.getPosition().z
        ),
      })
      .call(() => {
        this.tweenWorking = false;
      })
      .start();
  }

  onTouchMove(event: EventTouch) {
    if (
      this.moveCharacters &&
      this.characters.children.length > 0 &&
      !this.tweenWorking
    ) {
      this.mouse.x =
        (event.getUILocation().x / View.instance.getVisibleSize().width - 0.5) *
        2;
      const mappedX = this.mouse.x * this.moveRange;

      // const centerCharacterIndex = Math.floor(
      //   this.characters.children.length / 2
      // );

      this.characters.setPosition(
        mappedX,
        this.characters.getPosition().y,
        this.characters.getPosition().z
      );

      // for (let i = 0; i < this.characters.children.length; i++) {
      //   if (i !== centerCharacterIndex) {
      //     // gsap.gsap.to(this.characters.children[i].position, {
      //     //   duration: 0.4,
      //     //   x:
      //     //     mappedX +
      //     //     this.characters.getComponent(CharactersManager)
      //     //       .characterPositions[i].x,
      //     // });

      //     tween(this.characters.children[i])
      //       .to(0.2, {
      //         position: new Vec3(
      //           mappedX +
      //             this.characters.getComponent(CharactersManager)
      //               .characterPositions[i].x,
      //           this.characters.children[i].getPosition().y,
      //           this.characters.children[i].getPosition().z
      //         ),
      //       })
      //       .start();
      //   }
      // }
    }
  }

  onTouchEnd(event: EventTouch) {
    this.moveCharacters = false;
  }

  setActive(btn: Node, value: boolean) {
    btn.active = value;
    btn.getComponent(Button).interactable = value;
  }

  onRestartBtnClick() {
    this.restartGame();
    this.setActive(this.restartBtn, false);
    this.setActive(this.startBtn, true);
  }

  restartGame() {
    this.gameStarted = false;
    this.gameEnded = false;
    this.characters.getComponent(CharactersManager).removeAllCharacters();
    const removeCharactersTimeoutArray =
      this.characters.getComponent(CharactersManager).removeCharacterTimeout;
    if (removeCharactersTimeoutArray.length > 0) {
      removeCharactersTimeoutArray.forEach((timeout) => {
        clearTimeout(timeout);
      });
    }
    if (this.gameEndType === GAME_END_TYPE.VILLIAN_ENDING) {
      const villianController = this.level
        .getComponent(Level)
        .finishLineNode.getComponent(FinishLine)
        .endVillian.getComponent(VillianController);
      if (villianController.victoryTimeout) {
        clearInterval(villianController.victoryTimeout);
      }
      villianController.playIdleAnimation();
    }
    this.endGameTimeouts && clearTimeout(this.endGameTimeouts);
    this.setupInitialCharacters();
    this.characters.parent.setPosition(0, 0, 0);
    this.characters.setPosition(0, 0, 0);
    this.setActive(this.restartBtn, false);
    this.level.getComponent(Level).destroyLevel();
    this.level.getComponent(Level).setupPath();
  }

  onGameEnd() {
    this.gameEnded = true;
    this.gameEndType = this.level.getComponent(Level).gameEndType;
    if (this.gameEndType === GAME_END_TYPE.RACE_ENDING) {
      this.characters.getComponent(CharactersManager).playDanceAnimations();
    } else if (this.gameEndType === GAME_END_TYPE.VILLIAN_ENDING) {
      this.characters.getComponent(CharactersManager).playFightingAnimations();
      const villian = this.level
        .getComponent(Level)
        .finishLineNode.getComponent(FinishLine)
        .endVillian.getComponent(VillianController);
      villian.playKillingAnimation();
      this.endGameTimeouts = setTimeout(() => {
        if (this.characters.children.length > 25) {
          this.characters.getComponent(CharactersManager).playDanceAnimations();
          villian.playDieAnimation();
        } else {
          this.characters.getComponent(CharactersManager).playDyingAnimation();
          villian.playRoarAnimation();
        }
      }, 5000);
    }
    input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.setActive(this.restartBtn, true);
  }

  update(deltaTime: number) {
    if (
      this.characters.parent.getPosition().z <=
        this.level.getComponent(Level).gameEndPoint &&
      !this.gameEnded
    ) {
      this.onGameEnd();
    }
  }
}
