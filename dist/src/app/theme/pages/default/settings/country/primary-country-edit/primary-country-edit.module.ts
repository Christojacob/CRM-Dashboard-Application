import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { DefaultComponent } from '../../../default.component';
import { PrimaryCountryEditComponent } from './primary-country-edit.component';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CountryPipe } from '../country.pipe';

const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': PrimaryCountryEditComponent,
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
        PrimaryCountryEditComponent,
        CountryPipe
    ],
})
export class PrimaryCountryEditModule {
}