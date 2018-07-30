import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeContainerComponent } from './home/home-container/home-container.component';
import { NotFoundContainerComponent } from './error-management/not-found-container/not-found-container.component';
import { ErrorManagementModule } from './error-management/error-management.module';
import { HomeModule } from './home/home.module';
import { NavigationModule } from './navigation/navigation.module';
import { ToolbarContainerComponent } from './navigation/toolbar-container/toolbar-container.component';
import { SettingsContainerComponent } from './settings/settings-container/settings-container.component';
import { SettingsModule } from './settings/settings.module';
import { ImageListContainerComponent } from './daemon-tools/image-list-container/image-list-container.component';
import { DaemonToolsModule } from './daemon-tools/daemon-tools.module';
import { ContainerAttacherContainerComponent } from './daemon-tools/container-attacher-container/container-attacher-container.component';
import { ContainerExecContainerComponent } from './daemon-tools/container-exec-container/container-exec-container.component';
import { RegistryListContainerComponent } from './registry/registry-list-container/registry-list-container.component';
import { ApplicationListContainerComponent } from './application-templates/application-list-container/application-list-container.component';
import {
    ApplicationLaunchContainerComponent
} from './application-templates/application-launch-container/application-launch-container.component';
import { ApplicationTemplatesModule } from './application-templates/application-templates.module';
import { ContainerCreateContainerComponent } from './daemon-tools/container-create-container/container-create-container.component';

export const routes: Routes = [
    {
        path: '',
        component: ToolbarContainerComponent,
        children: [
            {
                path: '',
                component: HomeContainerComponent,
            },
            {
                path: 'applications',
                component: ApplicationListContainerComponent,
            },
            {
                path: 'applications/:appId/launch',
                component: ApplicationLaunchContainerComponent
            },
            {
                path: 'settings',
                component: SettingsContainerComponent,
            },

            {
                path: 'docker/images',
                component: ImageListContainerComponent,
            },
            {
                path: 'docker/containers/create',
                component: ContainerCreateContainerComponent,
            },
            {
                path: 'docker/containers/:containerId/attach',
                component: ContainerAttacherContainerComponent,
            },
            {
                path: 'docker/containers/:containerId/exec',
                component: ContainerExecContainerComponent,
            },

            {
                path: 'registry/:registryName',
                component: RegistryListContainerComponent,
            },

            { path: '**', component: NotFoundContainerComponent }
        ]
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { useHash: true }),

        ErrorManagementModule,
        HomeModule,
        NavigationModule,
        ApplicationTemplatesModule,
        SettingsModule,
        DaemonToolsModule,
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
