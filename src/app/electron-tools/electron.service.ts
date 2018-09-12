import { Injectable } from '@angular/core';
import { Remote, WebFrame, IpcRenderer } from 'electron';
import * as ChildProcess from 'child_process';
import * as FS from 'fs';
import * as ElectronUpdater from 'electron-updater';
import * as ElectronSettings from 'electron-settings';

interface ElectronWindow extends Window {
  process: any;
  require: any;
}

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  public ipcRenderer: IpcRenderer;
  public webFrame: WebFrame;
  public remote: Remote;
  public childProcess: typeof ChildProcess;
  public fs: typeof FS;
  public electronUpdater: typeof ElectronUpdater;
  public electronSettings: typeof ElectronSettings;

  private get electronWindow() {
    return window as ElectronWindow;
  }

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = this.electronWindow.require('electron').ipcRenderer;
      this.webFrame = this.electronWindow.require('electron').webFrame;
      this.remote = this.electronWindow.require('electron').remote;
      this.childProcess = this.electronWindow.require('child_process');
      this.fs = this.electronWindow.require('fs');

      this.electronUpdater = this.remote.require('electron-updater');
      this.electronSettings = this.remote.require('electron-settings');
    }
  }

  public isElectron = () => {
    return this.electronWindow
      && this.electronWindow.process
      && this.electronWindow.process.type;
  }
}
