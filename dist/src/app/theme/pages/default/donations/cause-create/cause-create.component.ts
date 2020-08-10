import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { Helpers } from '../../../../../helpers';
import { SubApplicationService } from '../../settings/sub-application/sub-application.service';
import { CountryService } from '../../settings/country/country.service';
import { PaymentService } from '../../settings/payment/payment.service';
import { DonationsService } from '../donations.service';

declare let $: any;

@Component({
    selector: 'app-cause-create',
    templateUrl: './cause-create.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class CauseCreateComponent implements OnInit {

    countryList: any;
    createForm: any;
    formError = false;
    PaymentOptions: any = [];
    PaymentCountryOption: any = [];
    subapplicationList: any;
    primCountryList: any;
    frequencyList: any;
    CurrencyList: any;
    Amount: any = [];

    constructor(
        public formBuilder: FormBuilder,
        public _subApplication: SubApplicationService,
        public _countryList: CountryService,
        public _payment: PaymentService,
        public _donation: DonationsService
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

    create() {
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

        console.log(this.createForm.value)
        Helpers.setLoading(true);
        this.formError = true;
        this._donation.causeCreate(this.createForm.value).subscribe(
            data => {
                console.log(data);
                if (data.status == 'success') {
                    Helpers.setLoading(false);
                    Helpers.DisplayMsg(data)
                    this.createForm.reset()
                    this.formInit();
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

}
