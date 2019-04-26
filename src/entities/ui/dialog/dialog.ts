import { SpeechBubble } from "./speechBubble";
import { SpeechBubbleConfigs } from "./speechBubbleConfigs";
import { InputKeys } from '../../../helpers/inputKeys/inputKeys';

export class Dialog extends Phaser.GameObjects.Rectangle {

  private speechBubbles: { [key: string]: SpeechBubble } = {};
  private dialog: DialogConfigs[];
  private dialogIndex: number = 0;

  constructor(scene: Phaser.Scene, speakers: SpeakerConfig[]) {
    super(scene, 0, 0);

    for (let i = 0; i < speakers.length; i++) {
      let speaker = speakers[i];
      this.speechBubbles[speaker.key] = new SpeechBubble(this.scene, speaker.x, speaker.y, '', speaker.isOnTheRight);
      this.speechBubbles[speaker.key].on('done', this.onSpeechBubbleDone, this);
    }

    this.scene.input.keyboard.on('keydown', (key) => {
      if (key.keyCode == Phaser.Input.Keyboard.KeyCodes.DOWN || key.keyCode == Phaser.Input.Keyboard.KeyCodes.S) {
        this.skipActiveSpeechBubbles();
      }
    });
  }

  skipActiveSpeechBubbles(): void {
    for (const speaker in this.speechBubbles) {
      if (this.speechBubbles.hasOwnProperty(speaker)) {
        const speechBubble = this.speechBubbles[speaker];
        if (speechBubble.isActive()) speechBubble.skip();
      }
    }
  }

  startDialog(dialog: DialogConfigs[]): void {
    this.dialog = dialog;
    this.dialogIndex = 0;
    let speech: DialogConfigs = this.dialog[this.dialogIndex];
    this.speechBubbles[speech.key].setText(speech.text, speech.config);
  }

  onSpeechBubbleDone(text: string): void {
    this.dialogIndex++;
    if (this.dialogIndex >= this.dialog.length) {
      this.endDialog();
      return;
    }
    let speech: DialogConfigs = this.dialog[this.dialogIndex];
    if (!this.speechBubbles[speech.key])
      this.onSpeechBubbleDone('');
    else
      this.speechBubbles[speech.key].setText(speech.text, speech.config);
  }

  endDialog(): void {
    for (const key in this.speechBubbles) {
      this.speechBubbles[key].remove();
    }
    this.emit('done');
  }
}

class SpeakerConfig {
  key: string;
  x: number;
  y: number;
  isOnTheRight: boolean;
}

class DialogConfigs {
  key: string;
  text: string;
  config: SpeechBubbleConfigs;
}