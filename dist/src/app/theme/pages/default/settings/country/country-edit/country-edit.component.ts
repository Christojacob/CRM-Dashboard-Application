import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Helpers } from '../../../../../../helpers';

import { CountryService } from '../country.service';
import { PaymentService } from '../../payment/payment.service';

@Component({
    selector: 'app-country-edit',
    templateUrl: './country-edit.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class CountryEditComponent implements OnInit, AfterViewInit {

    countryList: any;
    createForm: any;
    paymentForm: any;
    formError = false;
    routeParams: any;
    selectedTab: any = 'edit';

    paymentMaster: any;
    paymentMethod: any;
    paymentGateway: any;

    PaymentSettings: any = [];

    constructor(public formBuilder: FormBuilder, private _countryService: CountryService, private _paymentService: PaymentService, private activeRoute: ActivatedRoute) {
        this.formInit();

    }



    ngOnInit() {
        this.getPrimaryCountry();
        this.getPaymentMaster();
        this.routeParams = this.activeRoute.snapshot.params;
    }

    ngAfterViewInit() {

    }

    formInit() {
        this.createForm = this.formBuilder.group({
            Name: ['', Validators.required],
            SortName: ['', Validators.required],
            Currency: ['', Validators.required],
            CurrencySymbol: [0, Validators.required],
            PhoneCode: ['', Validators.required],
            PrimaryCountryId: [0],
        });

        this.paymentForm = this.formBuilder.group({
            PaymentSettings: this.formBuilder.array([this.createPayment()]),
        });
    }

    getPrimaryCountry() {

        return this._countryService.countryList({ PrimaryCountryOnly: 1 }).subscribe(
            data => {
                this.countryList = data.data;
                this.getEditContry()
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    getEditContry() {
        Helpers.setLoading(true);
        return this._countryService.countryEdit(this.routeParams.CountryId).subscribe(
            data => {
                Helpers.setLoading(false);
                let country = data.data.Country
                let pcountry = country.PrimaryCountryId != null ? country.PrimaryCountryId : 0;
                this.createForm = this.formBuilder.group({
                    Name: [country.Name, Validators.required],
                    SortName: [country.SortName, Validators.required],
                    Currency: [country.Currency, Validators.required],
                    CurrencySymbol: [country.CurrencySymbol, Validators.required],
                    PhoneCode: [country.PhoneCode, Validators.required],
                    PrimaryCountryId: [pcountry],
                });

                let paySettings = data.data.PaymentSettings

                this.paymentForm = this.formBuilder.group({
                    PaymentSettings: this.formBuilder.array([]),
                });
                this.PaymentSettings = this.paymentForm.get('PaymentSettings') as FormArray;

                for (let i = 0; i < paySettings.length; i++) {
                    let gatway: any;
                    if (paySettings[i].GatewayId == null) {
                        gatway = '';
                    } else {
                        gatway = paySettings[i].GatewayId;
                    }
                    this.PaymentSettings.push(
                        this.formBuilder.group({
                            Id: [paySettings[i].Id],
                            PaymentMethodId: [paySettings[i].PaymentMethodId, Validators.required],
                            IsBackendOnly: [paySettings[i].IsBackendOnly],
                            GatewayId: [gatway],
                            MerchantId: [paySettings[i].MerchantId],
                            PublicKey: [paySettings[i].PublicKey],
                            Secret: [paySettings[i].Secret],
                            BankAccountDetails: [paySettings[i].BankAccountDetails],
                        })
                    );
                }
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    update() {
        this.formError = true;
        if (this.selectedTab == 'edit') {
            if (!this.createForm.valid) {
                Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
            } else {
                Helpers.setLoading(true);
                this._countryService.countryUpdate(this.createForm.value, this.routeParams.CountryId).subscribe(
                    data => {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg(data)
                        this.formError = false;
                    },
                    error => {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg({ status: 'error', msg: 'Something when wrong.Please try later' })
                    });
            }
        } else {
            if (!this.paymentForm.valid) {
                Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
            } else {

                Helpers.setLoading(true);
                this._paymentService.paymentMasterAdd(this.paymentForm.value, this.routeParams.CountryId).subscribe(
                    data => {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg(data)
                        this.formError = false;
                        this.getEditContry()
                    },
                    error => {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg({ status: 'error', msg: 'Something when wrong.Please try later' })
                    });
            }
        }
    }

    getPaymentMaster() {

        return this._paymentService.paymentMaster({}).subscribe(
            data => {
                this.paymentMaster = data.data;
                this.paymentMethod = this.paymentMaster.PaymentMethod;
                this.paymentGateway = this.paymentMaster.PaymentGateway;
            },
            error => {
                console.log("Some error tiggered" + error)
            });

    }

    createPayment(): FormGroup {
        return this.formBuilder.group({
            PaymentMethodId: [0, Validators.required],
            IsBackendOnly: [1],
            GatewayId: [''],
            MerchantId: [''],
            PublicKey: [''],
            Secret: [''],
            BankAccountDetails: [''],
        })
    }

    addPaymentOption() {
        this.PaymentSettings = this.paymentForm.get('PaymentSettings') as FormArray;
        this.PaymentSettings.push(this.createPayment());
    }

    removeOption(i) {
        this.PaymentSettings.removeAt(i)
    }

}
