import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default.component';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { StateEditComponent } from './state-edit.component';

const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': StateEditComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule,
        ReactiveFormsModule
    ], exports: [
        RouterModule,
        FormsModule,
    ], declarations: [
        StateEditComponent,
    ],
})
export class StateEditModule {
}