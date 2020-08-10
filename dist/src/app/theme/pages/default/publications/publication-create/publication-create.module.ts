import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { PublicationCreateComponent } from './publication-create.component';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';

const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': PublicationCreateComponent,
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
        PublicationCreateComponent,
    ],
})
export class PublicationCreateModule {
}