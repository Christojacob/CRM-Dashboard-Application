import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxBraintreeModule } from 'ngx-braintree';
import { HttpClientModule } from '@angular/common/http';


import { MemberViewComponent } from './member-view.component';
import { MemberFamilyComponent } from '../member-family/member-family.component';
import { MemberProfileComponent } from '../member-profile/member-profile.component';
import { MemberAddressComponent } from '../member-address/member-address.component';
import { MemberCardComponent } from '../member-card/member-card.component';

const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': MemberViewComponent,
                'children': [
                    {
                        'path': '',
                        'component': MemberProfileComponent,
                    }, {
                        'path': 'family',
                        'component': MemberFamilyComponent,
                    }, {
                        'path': 'address',
                        'component': MemberAddressComponent,
                    }, {
                        'path': 'card',
                        'component': MemberCardComponent,
                    }
                ]
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule,
        ReactiveFormsModule, FormsModule,
        NgxBraintreeModule, HttpClientModule
    ], exports: [
        RouterModule,
        FormsModule,
    ], declarations: [
        MemberViewComponent,
        MemberProfileComponent,
        MemberFamilyComponent,
        MemberAddressComponent,
        MemberCardComponent
    ],
})
export class MemberViewModule {
}