import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as electronUpdater from 'electron-updater';

interface ElectronWindow extends Window {
  process: any;
  require: any;
}

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  public ipcRenderer: typeof ipcRenderer;
  public webFrame: typeof webFrame;
  public remote: typeof remote;
  public childProcess: typeof childProcess;
  public fs: typeof fs;
  public electronUpdater: typeof electronUpdater;

  private get electronWindow() {
    return window as ElectronWindow;
  }

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = this.electronWindow.require('electron').ipcRenderer;
      this.webFrame = this.electronWindow.require('electron').webFrame;
      this.remote = this.electronWindow.require('electron').remote;
      this.electronUpdater = this.remote.require('electron-updater') as typeof electronUpdater;

      this.childProcess = this.electronWindow.require('child_process');
      this.fs = this.electronWindow.require('fs');
    }
  }

  public isElectron = () => {
    return this.electronWindow
      && this.electronWindow.process
      && this.electronWindow.process.type;
  }
}
