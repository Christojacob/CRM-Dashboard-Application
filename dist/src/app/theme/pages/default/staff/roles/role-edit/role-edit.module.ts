import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default.component';
import { RoleEditComponent } from './role-edit.component';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';

const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': RoleEditComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule,
        ReactiveFormsModule,
    ], exports: [
        RouterModule,
        FormsModule,
    ], declarations: [
        RoleEditComponent,
    ],
})
export class RoleAddModule{
}