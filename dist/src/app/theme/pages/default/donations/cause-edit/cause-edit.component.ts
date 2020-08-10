import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Helpers } from '../../../../../helpers';

import { SubApplicationService } from '../../settings/sub-application/sub-application.service';
import { CountryService } from '../../settings/country/country.service';
import { PaymentService } from '../../settings/payment/payment.service';
import { DonationsService } from '../donations.service';

declare let $: any;

@Component({
    selector: 'app-cause-edit',
    templateUrl: './cause-edit.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class CauseEditComponent implements OnInit {

    countryList: any;
    createForm: any;
    formError = false;
    PaymentOptions: any = [];
    PaymentCountryOption: any = [];
    subapplicationList: any;
    primCountryList: any;
    frequencyList: any;
    CurrencyList: any;
    routeParams: any;

    constructor(
        public formBuilder: FormBuilder,
        public _subApplication: SubApplicationService,
        public _countryList: CountryService,
        public _payment: PaymentService,
        public _donation: DonationsService,
        private activeRoute: ActivatedRoute
    ) {
        this.formInit();
    }

    formInit() {
        this.createForm = this.formBuilder.group({
            CauseName: ['', Validators.required],
            Description: [''],
            SubApplications: ['', Validators.required],
            AcceptAnyAmount: [0],
            PaymentAccountType: [1],
            PaymentOptions: this.formBuilder.array([this.createCountryOption()]),
            RestrictedCountries: [''],
        });
    }

    ngOnInit() {
        this.routeParams = this.activeRoute.snapshot.params;
        this.getEditCause();
        this._subApplication.SubApplicationList().subscribe(
            data => {
                this.subapplicationList = data.data;
                let subdata = [];
                for (let i = 0; i < this.subapplicationList.length; i++) {
                    subdata.push({ id: this.subapplicationList[i].RecordID, text: this.subapplicationList[i].SubApplication })
                }

                $('#subapplications').select2({
                    placeholder: "Eg: Shalom Tidings",
                    data: subdata
                });

            },
            error => {
                console.log("Some error tiggered" + error)
            });


        this._countryList.allCountry({}).subscribe(
            data => {
                this.countryList = data.data.CountryList;
                let countrydata = [];
                for (let i = 0; i < this.countryList.length; i++) {
                    countrydata.push({ id: this.countryList[i].Id, text: this.countryList[i].Name })
                }

                $('#RestrictedCountries').select2({
                    placeholder: "Eg: UK",
                    data: countrydata
                });

            },
            error => {
                console.log("Some error tiggered" + error)
            });

        this._countryList.allCountry({ PrimaryCountryOnly: 1 }).subscribe(
            data => {
                this.primCountryList = data.data.CountryList;
            },
            error => {
                console.log("Some error tiggered" + error)
            });

        this._payment.paymentFrequency().subscribe(
            data => {
                this.frequencyList = data.data.RecurringFrequencyList;
            },
            error => {
                console.log("Some error tiggered" + error)
            }
        )

        this._countryList.CurrencyList().subscribe(
            data => {
                this.CurrencyList = data.data;
            },
            error => {
                console.log("Some error tiggered" + error)
            }
        )
    }

    getEditCause() {
        Helpers.setLoading(true);
        return this._donation.CauseEdit(this.routeParams.CauseId).subscribe(
            data => {
                Helpers.setLoading(false);
                let cause = data.data.CauseDetails;
                let paymentCountryOptionstmp: any = this.formBuilder.array([]) as FormArray;
                let paymentOptionstmp: any;
                for (let i = 0; i < cause.PaymentOptions.length; i++) {
                    paymentOptionstmp = this.formBuilder.array([]) as FormArray;
                    for (let k = 0; k < cause.PaymentOptions[i].PaymentOptionValues.length; k++) {
                        paymentOptionstmp.push(
                            this.formBuilder.group({
                                PaymentOptionText: cause.PaymentOptions[i].PaymentOptionValues[k].PaymentOptionText,
                                Amount: cause.PaymentOptions[i].PaymentOptionValues[k].Amount,
                                FrequencyId: cause.PaymentOptions[i].PaymentOptionValues[k].FrequencyId
                            }))
                    }
                    paymentCountryOptionstmp.push(this.formBuilder.group({
                        PrimaryCountryId: cause.PaymentOptions[i].PrimaryCountryId,
                        CurrencyCode: cause.PaymentOptions[i].CurrencyCode,
                        MinimumAmount: cause.PaymentOptions[i].MinimumAmount,
                        PaymentOptionValues: paymentOptionstmp
                    }))
                }

                this.createForm = this.formBuilder.group({
                    CauseName: [cause.Title, Validators.required],
                    Description: [cause.Description],
                    SubApplications: ['', Validators.required],
                    AcceptAnyAmount: [cause.AnyAmount],
                    PaymentAccountType: [cause.PaymentAccountType],
                    PaymentOptions: paymentCountryOptionstmp,
                    RestrictedCountries: [''],
                });

                let subid = [];
                for (let i = 0; i < cause.SubApplications.length; i++) {
                    subid[i] = cause.SubApplications[i].Id;
                }
                $('#subapplications').val(subid);
                $('#subapplications').trigger('change');

                let countid = [];
                for (let i = 0; i < cause.RestrictedCountries.length; i++) {
                    countid[i] = cause.RestrictedCountries[i].Id;
                }
                $('#RestrictedCountries').val(countid);
                $('#RestrictedCountries').trigger('change');

            },
            error => {
                console.log("Some error tiggered" + error)
            });

    }

    createOption(): FormGroup {
        return this.formBuilder.group({
            PaymentOptionText: '',
            Amount: '',
            FrequencyId: 0
        })
    }

    createCountryOption(): FormGroup {
        return this.formBuilder.group({
            PrimaryCountryId: 0,
            CurrencyCode: 0,
            MinimumAmount: '',
            PaymentOptionValues: this.formBuilder.array([this.createOption()])
        })
    }

    addOption(i): void {
        console.log(i)
        this.PaymentOptions = (this.createForm.controls['PaymentOptions']).at(i).get('PaymentOptionValues') as FormArray;
        // this.PaymentOptions = this.createForm.get('PaymentOptions') as FormArray;
        this.PaymentOptions.push(this.createOption());
    }

    removeOption(i) {
        this.PaymentOptions.removeAt(i)
    }

    removeCountryOption(i) {
        this.PaymentCountryOption.removeAt(i)
    }

    addCountry() {
        this.PaymentCountryOption = this.createForm.get('PaymentOptions') as FormArray;
        this.PaymentCountryOption.push(this.createCountryOption());
    }

    ChangePaymentAccount() {
        this.PaymentCountryOption = this.createForm.get('PaymentOptions') as FormArray;
        this.PaymentOptions = (this.createForm.controls['PaymentOptions']).at(0).get('PaymentOptionValues') as FormArray;
        let _self = this;
        while (this.PaymentCountryOption.length !== 1) {
            _self.PaymentCountryOption.removeAt(0)
        }

        while (this.PaymentOptions.length !== 1) {
            _self.PaymentOptions.removeAt(0)
        }
    }

    update() {
        let subapplication = $("#subapplications").val();
        let subapplication_param = [];
        for (let i = 0; i < subapplication.length; i++) {
            subapplication_param[i] = { Id: subapplication[i] }
        }
        this.createForm.value.SubApplications = subapplication_param;

        let rescountries = $("#RestrictedCountries").val();
        let rescountries_param = [];
        for (let i = 0; i < rescountries.length; i++) {
            rescountries_param[i] = { Id: rescountries[i] }
        }
        this.createForm.value.RestrictedCountries = rescountries_param;

        Helpers.setLoading(true);
        this.formError = true;
        this._donation.CauseUpdate(this.createForm.value, this.routeParams.CauseId).subscribe(
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
                console.log("Some error tiggered" + error)
                Helpers.DisplayMsg({ status: 'error', msg: 'Something when wrong.Please try later' })
                Helpers.setLoading(false);
            }
        )
    }

}
