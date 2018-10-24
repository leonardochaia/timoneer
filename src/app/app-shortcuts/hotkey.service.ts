/**
 * This is a lightweight version of angular2-hotkeys
 * It only contains the HotKeyService.
 * This was done since angular2-hotkeys does not seem to be regularly updated
 * Credits to https://github.com/brtnshrdr/angular2-hotkeys/
 */

import { Injectable } from '@angular/core';
import 'mousetrap';

export class Hotkey {

    public get formatted(): string[] {
        if (!this.cachedFormatted) {
            const combo: string = this.combo[0];
            const sequence: string[] = combo.split(/[\s]/);
            for (let i = 0; i < sequence.length; i++) {
                sequence[i] = Hotkey.symbolize(sequence[i]);
            }
            this.cachedFormatted = sequence;
        }
        return this.cachedFormatted;
    }
    public cachedFormatted: string[];

    /**
     * Creates a new Hotkey for Mousetrap binding
     *
     * @param {string}   combo       mousetrap key binding
     * @param {string}   description description for the help menu
     * @param {Function} callback    method to call when key is pressed
     * @param {string}   action      the type of event to listen for (for mousetrap)
     * @param {array}    allowIn     an array of tag names to allow this combo in ('INPUT', 'SELECT', and/or 'TEXTAREA')
     * @param {boolean}  persistent  if true, the binding is preserved upon route changes
     */
    constructor(public combo: string | string[], public callback: (event: KeyboardEvent, combo: string) => ExtendedKeyboardEvent | boolean,
        public allowIn?: string[], public description?: string | Function, public action?: string,
        public persistent?: boolean) {
        this.combo = (Array.isArray(combo) ? combo : [<string>combo]);
        this.allowIn = allowIn || [];
        this.description = description || '';
    }

    public static symbolize(combo: string): string {
        const map: any = {
            command: '\u2318',       // ⌘
            shift: '\u21E7',         // ⇧
            left: '\u2190',          // ←
            right: '\u2192',         // →
            up: '\u2191',            // ↑
            down: '\u2193',          // ↓
            'return': '\u23CE',      // ⏎
            backspace: '\u232B'      // ⌫
        };
        const comboSplit: string[] = combo.split('+');

        for (let i = 0; i < comboSplit.length; i++) {
            // try to resolve command / ctrl based on OS:
            if (comboSplit[i] === 'mod') {
                if (window.navigator && window.navigator.platform.indexOf('Mac') >= 0) {
                    comboSplit[i] = 'command';
                } else {
                    comboSplit[i] = 'ctrl';
                }
            }

            comboSplit[i] = map[comboSplit[i]] || comboSplit[i];
        }

        return comboSplit.join(' + ');
    }
}

@Injectable()
export class HotkeysService {
    public hotkeys: Hotkey[] = [];
    public pausedHotkeys: Hotkey[] = [];
    public mousetrap: MousetrapInstance;

    private preventIn = ['INPUT', 'SELECT', 'TEXTAREA'];

    constructor() {
        Mousetrap.prototype.stopCallback = (event: KeyboardEvent, element: HTMLElement) => {
            // if the element has the class "mousetrap" then no need to stop
            if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
                return false;
            }
            return (element.contentEditable && element.contentEditable === 'true');
        };
        this.mousetrap = new (<any>Mousetrap)();
    }

    public add(hotkey: Hotkey | Hotkey[], specificEvent?: string): Hotkey | Hotkey[] {
        if (Array.isArray(hotkey)) {
            const temp: Hotkey[] = [];
            for (const key of hotkey) {
                temp.push(<Hotkey>this.add(key, specificEvent));
            }
            return temp;
        }
        this.remove(hotkey);
        this.hotkeys.push(<Hotkey>hotkey);
        this.mousetrap.bind((<Hotkey>hotkey).combo, (event: KeyboardEvent, combo: string) => {
            let shouldExecute = true;

            // if the callback is executed directly `hotkey.get('w').callback()`
            // there will be no event, so just execute the callback.
            if (event) {
                const target: HTMLElement = <HTMLElement>(event.target || event.srcElement); // srcElement is IE only
                const nodeName: string = target.nodeName.toUpperCase();

                // check if the input has a mousetrap class, and skip checking preventIn if so
                if ((' ' + target.className + ' ').indexOf(' mousetrap ') > -1) {
                    shouldExecute = true;
                } else if (this.preventIn.indexOf(nodeName) > -1
                    && (<Hotkey>hotkey).allowIn.map(allow => allow.toUpperCase()).indexOf(nodeName) === -1) {
                    // don't execute callback if the event was fired from inside an element listed in preventIn but not in allowIn
                    shouldExecute = false;
                }
            }

            if (shouldExecute) {
                return (<Hotkey>hotkey).callback.apply(this, [event, combo]);
            }
        }, specificEvent);
        return hotkey;
    }

    public remove(hotkey?: Hotkey | Hotkey[]): Hotkey | Hotkey[] {
        const temp: Hotkey[] = [];
        if (!hotkey) {
            for (const key of this.hotkeys) {
                temp.push(<Hotkey>this.remove(key));
            }
            return temp;
        }
        if (Array.isArray(hotkey)) {
            for (const key of hotkey) {
                temp.push(<Hotkey>this.remove(key));
            }
            return temp;
        }
        const index = this.findHotkey(<Hotkey>hotkey);
        if (index > -1) {
            this.hotkeys.splice(index, 1);
            this.mousetrap.unbind((<Hotkey>hotkey).combo);
            return hotkey;
        }
        return null;
    }

    public get(combo?: string | string[]): Hotkey | Hotkey[] {
        if (!combo) {
            return this.hotkeys;
        }
        if (Array.isArray(combo)) {
            const temp: Hotkey[] = [];
            for (const key of combo) {
                temp.push(<Hotkey>this.get(key));
            }
            return temp;
        }
        for (let i = 0; i < this.hotkeys.length; i++) {
            if (this.hotkeys[i].combo.indexOf(<string>combo) > -1) {
                return this.hotkeys[i];
            }
        }
        return null;
    }

    public pause(hotkey?: Hotkey | Hotkey[]): Hotkey | Hotkey[] {
        if (!hotkey) {
            return this.pause(this.hotkeys);
        }
        if (Array.isArray(hotkey)) {
            const temp: Hotkey[] = [];
            for (const key of hotkey) {
                temp.push(<Hotkey>this.pause(key));
            }
            return temp;
        }
        this.remove(hotkey);
        this.pausedHotkeys.push(<Hotkey>hotkey);
        return hotkey;
    }

    public unpause(hotkey?: Hotkey | Hotkey[]): Hotkey | Hotkey[] {
        if (!hotkey) {
            return this.unpause(this.pausedHotkeys);
        }
        if (Array.isArray(hotkey)) {
            const temp: Hotkey[] = [];
            for (const key of hotkey) {
                temp.push(<Hotkey>this.unpause(key));
            }
            return temp;
        }
        const index: number = this.pausedHotkeys.indexOf(<Hotkey>hotkey);
        if (index > -1) {
            this.add(hotkey);
            return this.pausedHotkeys.splice(index, 1);
        }
        return null;
    }

    public reset() {
        this.mousetrap.reset();
    }

    private findHotkey(hotkey: Hotkey): number {
        return this.hotkeys.indexOf(hotkey);
    }
}
