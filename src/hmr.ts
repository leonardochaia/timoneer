import { NgModuleRef, ApplicationRef } from '@angular/core';
import { createNewHosts } from '@angularclass/hmr';

export const hmrBootstrap = (module: any, bootstrap: () => Promise<NgModuleRef<any>>) => {
    let ngModule: NgModuleRef<any>;
    module.hot.accept();
    bootstrap().then(mod => ngModule = mod);
    module.hot.dispose(() => {
        console.clear();
        // HACK: destroy all cdk overlays since they break with HMR.
        const overlays = document.getElementsByClassName('cdk-overlay-container');
        for (let i = 0; i < overlays.length; i++) {
            overlays[i].innerHTML = '';
        }

        if (ngModule) {
            const appRef: ApplicationRef = ngModule.injector.get(ApplicationRef);
            const elements = appRef.components.map(c => c.location.nativeElement);
            const makeVisible = createNewHosts(elements);
            ngModule.destroy();
            makeVisible();
        }
    });
};
