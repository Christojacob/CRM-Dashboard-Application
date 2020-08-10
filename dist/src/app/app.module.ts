import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme/theme.component';
import { LayoutModule } from './theme/layouts/layout.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScriptLoaderService } from "./_services/script-loader.service";
import { ThemeRoutingModule } from "./theme/theme-routing.module";
import { AuthModule } from "./auth/auth.module";
import { Helpers } from './helpers';

import { CountryService } from './theme/pages/default/settings/country/country.service';
import { StateService } from './theme/pages/default/settings/state/state.service';
import { PaymentService } from './theme/pages/default/settings/payment/payment.service';
import { FamilyRelationshipService } from './theme/pages/default/settings/family-relationship/family-relationship.service';
import { SubApplicationService } from './theme/pages/default/settings/sub-application/sub-application.service';
import { SalutationService } from './theme/pages/default/settings/salutation/salutation.service';
import { LanguageService } from './theme/pages/default/settings/language/language.service';
import { MemberService } from './theme/pages/default/members/member.service';
import { DonationsService } from './theme/pages/default/donations/donations.service';
import { CommonCrudService } from './_services/common-crud.service';
import { CouponService } from './theme/pages/default/settings/coupon/coupon.service';
import { PublicationService } from './theme/pages/default/publications/publication.service';
import { StaffService } from './theme/pages/default/staff/users/staff.service';





@NgModule({
    declarations: [
        ThemeComponent,
        AppComponent,
    ],
    imports: [
        LayoutModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ThemeRoutingModule,
        AuthModule,
    ],
    providers: [ScriptLoaderService, StaffService, PublicationService,   Helpers, CountryService,  StateService, PaymentService, FamilyRelationshipService, SubApplicationService, SalutationService, LanguageService, MemberService, DonationsService, CommonCrudService, CouponService],

    bootstrap: [AppComponent]
})
export class AppModule { }