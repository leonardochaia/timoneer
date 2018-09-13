import { MatDialogRef } from '@angular/material';
import { TimDialogRendererComponent } from './tim-dialog-renderer/tim-dialog-renderer.component';

export interface TimDialogData {
    title?: string;
    titleClass: string;
    message: string;
    confirmButton: TimDialogButtonConfiguration;
    cancelButton: TimDialogButtonConfiguration;
    debuggingInfo?: any;
}

export interface TimDialogButtonConfiguration {
    text: string;
    icon: string;
    action?: (dialog?: MatDialogRef<TimDialogRendererComponent>) => void;
    color?: 'primary' | 'accent' | 'warn';
}
