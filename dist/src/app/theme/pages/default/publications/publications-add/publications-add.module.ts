import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { PublicationsAddComponent } from './publications-add.component';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PriceSingleComponent } from './single/price-single.component';
import { PriceBulkComponent } from './bulk/price-bulk.component';
import { PriceComboComponent } from './combo/price-combo.component';
import { HttpClientModule } from '@angular/common/http';


const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': PublicationsAddComponent,
                'children':[
                    {
                        "path": "",
                        'component': PriceSingleComponent,
                    }, {
                        "path": "bulk",
                        'component': PriceBulkComponent,
                    }, {
                        "path": "combo",
                        'component': PriceComboComponent,
                    },
                ]
            },
            
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule,
        ReactiveFormsModule,HttpClientModule
    ], exports: [
        RouterModule,
        FormsModule
    ], declarations: [
        PublicationsAddComponent,
        PriceSingleComponent,
        PriceBulkComponent,
        PriceComboComponent,
    ],
})
export class PublicationsAddModule {
}