import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { Helpers } from '../../../../../../helpers';
import { ActivatedRoute } from '@angular/router';

import { CountryService } from '../country.service';
import { PaymentService } from '../../payment/payment.service';
import { CommonCrudService } from '../../../../../../_services/common-crud.service';

@Component({
    selector: 'app-primary-country-edit',
    templateUrl: './primary-country-edit.component.html',
    encapsulation: ViewEncapsulation.None
})
export class PrimaryCountryEditComponent implements OnInit {

    countryList: any;
    createForm: any;
    paymentForm: any;
    formError = false;
    countryLinkedList: any;
    routeParams: any;
    searchText: any;
    PrimaryCountry: any = { PrimaryCountryName: "" };
    selectedTab: any = 'edit';

    paymentMaster: any;
    paymentMethod: any;
    paymentGateway: any;
    gatewayArray: any = [];

    PaymentSettings: any = [];
    PaymentSettingsList: any;
    IsPaymentSettingsEdit = false;
    EditRowId: any;
    subscriptionOption: any;
    FrequencyList: any;


    constructor(public formBuilder: FormBuilder,
        private _countryService: CountryService,
        private activeRoute: ActivatedRoute,
        private _paymentService: PaymentService,
        private _crud: CommonCrudService
    ) {
        this.formInit();
        this.routeParams = activeRoute.snapshot.params;
    }

    ngOnInit() {
        this.getCountry();
        this.getPrimaryEdit();
        this.getPaymentMaster();
        this.getPaymentSettings();
        this.getFrequencyList();
    }

    formInit() {
        this.createForm = this.formBuilder.group({
            PrimaryCountryId: [0],
            SearchCountry: [''],
            LinkedCountry: this.formBuilder.array([])
        });

        this.paymentForm = this.formBuilder.group({
            PaymentSettings: this.formBuilder.array([this.createPayment()]),
        });
    }

    getCountry() {

        return this._countryService.primaryCountryPossibility().subscribe(
            data => {
                this.countryList = data.data;
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    getLinkedCountry() {
        return this._countryService.linkedCountryPossibility(this.routeParams.PrimaryCountryId).subscribe(
            data => {
                this.countryLinkedList = data.data;
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    getFrequencyList() {
        return this._crud.getData({ url: 'settings/recurring-frequency/list' }).subscribe(data => {
            this.FrequencyList = data.RecurringFrequencyList;
        },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    getPrimaryEdit() {
        Helpers.setLoading(true);
        return this._countryService.PrimaryCountryEdit(this.routeParams.PrimaryCountryId).subscribe(
            data => {
                this.PrimaryCountry = data.data;
                Helpers.setLoading(false);
                this.createForm.controls.PrimaryCountryId.setValue(this.PrimaryCountry.PrimaryCountryId);
                const LinkedCountry = this.createForm.get('LinkedCountry') as FormArray;

                for (let i = 0; i < this.PrimaryCountry.LinkedCountry.length; i++) {
                    LinkedCountry.push(this.formBuilder.group({
                        Id: this.PrimaryCountry.LinkedCountry[i].LinkedCountryId
                    }));
                }
                this.getLinkedCountry()

            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    onChange(id, Name, isChecked: boolean) {
        const LinkedCountry = this.createForm.get('LinkedCountry') as FormArray;

        if (isChecked) {
            LinkedCountry.push(this.formBuilder.group({
                Id: id
            }));
            this.PrimaryCountry.LinkedCountry.push({ LinkedCountryName: Name });
        } else {

            let index = LinkedCountry.value.findIndex(record => record.Id === id);
            LinkedCountry.removeAt(index);
            let index2 = this.PrimaryCountry.LinkedCountry.findIndex(record => record.LinkedCountryName === Name)
            this.PrimaryCountry.LinkedCountry.pop({ LinkedCountryName: Name });


        }
    }

    LinkedExist(id) {
        const LinkedCountry = this.createForm.get('LinkedCountry') as FormArray;
        let index = LinkedCountry.value.findIndex(x => x.Id === id)
        if (index != -1) {
            return true;
        }
        return false;
    }

    update() {
        this.formError = true;
        if (this.selectedTab == 'edit') {
            if (!this.createForm.valid) {
                Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
            } else {
                Helpers.setLoading(true);
                this._countryService.PrimaryCountryUpdate(this.createForm.value, this.routeParams.PrimaryCountryId).subscribe(
                    data => {
                        if (data.status == 'success') {
                            Helpers.setLoading(false);
                            Helpers.DisplayMsg(data)
                            this.formError = false;
                        } else {
                            Helpers.setLoading(false);
                            Helpers.DisplayMsg(data)
                        }

                    },
                    error => {
                        Helpers.DisplayMsg({ status: 'error', msg: 'Something when wrong.Please try later' })
                        Helpers.setLoading(false);
                    });
            }
        } else {
            if (this.IsPaymentSettingsEdit == false) {
                this._crud
                    .postData({ url: 'settings/primary-country/payment_settings/' + this.routeParams.PrimaryCountryId, params: this.paymentForm.value })
                    .subscribe(data => {
                        console.log(data);
                    }, error => {
                        console.log("Some error tiggered" + error)
                    })
            } else {
                this._crud
                    .putData({ url: 'settings/primary-country/payment_settings/update/' + this.routeParams.PrimaryCountryId + '/' + this.EditRowId, params: this.paymentForm.value })
                    .subscribe(data => {
                        console.log(data);
                    }, error => {
                        console.log("Some error tiggered" + error)
                    })
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
            RetryFrequency: [''],
            SubscriptionPlan: this.formBuilder.array([this.createSubscriptionPlan()]),
            LinkedCountryList: this.formBuilder.array([])
        })
    }

    createSubscriptionPlan(): FormGroup {
        return this.formBuilder.group({
            FrequencyId: [0],
            PlanId: []
        })
    }

    addPaymentOption() {
        this.PaymentSettings = this.paymentForm.get('PaymentSettings') as FormArray;
        this.PaymentSettings.push(this.createPayment());
    }

    removeOption(i) {
        this.PaymentSettings.removeAt(i)
    }

    addSubOption(i) {
        this.subscriptionOption = (this.paymentForm.controls['PaymentSettings']).at(i).get('SubscriptionPlan') as FormArray;
        this.subscriptionOption.push(this.createSubscriptionPlan());
    }

    removeSubOption(ex) {
        this.subscriptionOption.removeAt(ex)
    }

    gatewayUpdated(i) {
        let Gateway = (this.paymentForm.controls['PaymentSettings']).at(i).get('GatewayId') as FormArray;
        let index = this.paymentGateway.findIndex(record => record.Id === Gateway.value);
        this.gatewayArray[i] = this.paymentGateway[index].Identifier;
    }

    onPayCountryChange(id, Name, isChecked: boolean, num) {
        const LinkedCountry = (this.paymentForm.controls['PaymentSettings']).at(num).get('LinkedCountryList') as FormArray;

        if (isChecked) {
            LinkedCountry.push(this.formBuilder.group({
                Id: id
            }));
        } else {

            let index = LinkedCountry.value.findIndex(record => record.Id === id);
            LinkedCountry.removeAt(index);
            let index2 = this.PrimaryCountry.LinkedCountry.findIndex(record => record.LinkedCountryName === Name)

        }
    }

    getPaymentSettings() {
        this._crud.getData({ url: 'settings/primary-country/payment_settings/' + this.routeParams.PrimaryCountryId }).subscribe(data => {
            this.PaymentSettingsList = data.PaymentSettings;
            console.log('payment settings list (for edit) :', this.PaymentSettingsList);
        });
    }

    PaymentSettingsEdit(index) {
        this.IsPaymentSettingsEdit = true;

        let subscriptionList: any = this.formBuilder.array([]) as FormArray;
        if (this.PaymentSettingsList[index].SubscriptionPlan) {
            for (let i = 0; i < this.PaymentSettingsList[index].SubscriptionPlan.length; i++) {
                subscriptionList.push(this.formBuilder.group({
                    FrequencyId: this.PaymentSettingsList[index].SubscriptionPlan[i].FrequencyId,
                    PlanId: this.PaymentSettingsList[index].SubscriptionPlan[i].PlanId,
                }))
            }
        }

        this.PaymentSettings = this.paymentForm.get('PaymentSettings') as FormArray;
        let editedpayment = this.formBuilder.group({
            PaymentMethodId: [this.PaymentSettingsList[index].PaymentMethodId, Validators.required],
            IsBackendOnly: [this.PaymentSettingsList[index].IsBackendOnly],
            GatewayId: [this.PaymentSettingsList[index].PaymentGatewayId],
            MerchantId: [this.PaymentSettingsList[index].MerchantAccountNumber],
            PublicKey: [this.PaymentSettingsList[index].PublicKey],
            Secret: [this.PaymentSettingsList[index].Secret],
            BankAccountDetails: [this.PaymentSettingsList[index].BankDetails],
            RetryFrequency: [this.PaymentSettingsList[index].RetryFrequency],
            SubscriptionPlan: subscriptionList,
            LinkedCountryList: this.formBuilder.array(this.PaymentSettingsList[index].LinkedCountryList)
        })


        this.paymentForm = this.formBuilder.group({
            PaymentSettings: this.formBuilder.array([editedpayment]),
        })

        let Gateway = (this.paymentForm.controls['PaymentSettings']).at(0).get('GatewayId') as FormArray;
        let i = this.paymentGateway.findIndex(record => record.Id === Gateway.value);
        this.gatewayArray[0] = this.paymentGateway[i].Identifier;

        this.subscriptionOption = (this.paymentForm.controls['PaymentSettings']).at(0).get('SubscriptionPlan') as FormArray;

        this.EditRowId = this.PaymentSettingsList[index].RowId;

    }

    LinkedExistPaySettings(id) {
        const LinkedCountry = (this.paymentForm.controls['PaymentSettings']).at(0).get('LinkedCountryList') as FormArray;
        let index = LinkedCountry.value.findIndex(x => x.Id === id)
        if (index != -1) {
            return true;
        }
        return false;
    }

}
