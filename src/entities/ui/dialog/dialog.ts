import { SpeechBubble } from "./speechBubble";
import { SpeechBubbleConfigs } from "./speechBubbleConfigs";

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
    }

    testDialog():void {
        
    this.startDialog([
        {
          key: 'SibiMother',
          text: 'Sibi, is that you?',
          config: {
            addedDelay: 100,
            postPause: 1000
          }
        },
        {
          key: 'SibiMother',
          text: 'Oh dear',
          config: {
            addedDelay: 100,
            postPause: 1000
          }
        },
        {
          key: 'SibiMother',
          text: "You didn't have to risk your life for me",
          config: {
            addedDelay: 50,
            postPause: 1000
          }
        },
        {
          key: 'SibiMother',
          text: "You should have left when you could",
          config: {
            addedDelay: 50,
            postPause: 500
          }
        },
        {
          key: 'Sibi',
          text: 'Mom...',
          config: {}
        },
        {
          key: 'SibiMother',
          text: "I'm not worth saving...",
          config: { addedDelay: 50,
            postPause: 500 }
        },
        {
          key: 'SibiMother',
          text: "An old woman like me should be the last thing on your mind",
          config: {}
        },
        {
          key: 'Sibi',
          text: 'Mom!',
          config: {}
        },
        {
          key: 'SibiMother',
          text: 'You must be very scared',
          config: {
            postPause: 500
          }
        },
        {
          key: 'SibiMother',
          text: "You're brave for being here",
          config: {
            postPause: 500
          }
        },
        {
          key: 'SibiMother',
          text: "Oh, how I hate myself for having to put you through this, I...",
          config: {}
        },
        {
          key: 'Sibi',
          text: 'MOM, Enough!',
          config: {
            postPause: 1500
          }
        },
        {
          key: 'Sibi',
          text: "I'm here now, I'm getting you out of here",
          config: {
            postPause: 200
          }
        },
        {
          key: 'Sibi',
          text: "I'd come for you always and no matter what",
          config: {
            postPause: 600
          }
        },
        {
          key: 'Sibi',
          text: "Every single time",
          config: {
            postPause: 1500
          }
        },
        {
          key: 'SibiMother',
          text: "Oh, Sibi. I thought I was going to die",
          config: {
            addedDelay: 100
          }
        },
        {
          key: 'Sibi',
          text: "Mom...",
          config: {
            addedDelay: 50
          }
        },
        {
          key: 'SibiMother',
          text: "I was so scared",
          config: {
            addedDelay: 200
          }
        },
        {
          key: 'Sibi',
          text: "I...",
          config: {
            addedDelay: 50
          }
        },
        {
          key: 'SibiMother',
          text: "I am so scared",
          config: {
            addedDelay: 250
          }
        },
        {
          key: 'Sibi',
          text: "I know",
          config: {
            addedDelay: 100,
            postPause: 3000
          }
        },
        {
          key: 'Sibi',
          text: "Come on, let's get out of here",
          config: {}
        },
      ]);
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