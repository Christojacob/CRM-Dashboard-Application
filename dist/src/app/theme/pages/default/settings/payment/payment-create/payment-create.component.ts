import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Helpers } from '../../../../../../helpers';

import { CountryService } from '../../country/country.service';
import { PaymentService } from '../payment.service';

@Component({
    selector: 'app-payment-create',
    templateUrl: './payment-create.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class PaymentCreateComponent implements OnInit {

    countryList: any;
    paymentMaster: any;
    paymentMethod: any;
    paymentGateway: any;
    createForm: any;
    formError = false;

    constructor(public formBuilder: FormBuilder, private _countryService: CountryService, private _paymentService: PaymentService) {
        this.formInit();
    }

    ngOnInit() {
        this.getPrimaryCountry();
        this.getPaymentMaster();
    }


    formInit() {

        this.createForm = this.formBuilder.group({
            CountryId: [0, Validators.required],
            PaymentMethodId: [0, Validators.required],
            GatewayId: [0],
            MerchantId: [''],
            PublicKey: [''],
            Secret: [''],
            BankAccountDetails: [''],
        });

    }

    getPrimaryCountry() {

        return this._countryService.countryList({ PrimaryCountryOnly: 1 }).subscribe(
            data => {
                this.countryList = data.data;
            },
            error => {
                console.log("Some error tiggered" + error)
            });

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

    create() {

        this.formError = true;
        if (!this.createForm.valid) {
            Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
        } else {
            Helpers.setLoading(true);
            console.log(this.createForm.value)
            this._paymentService.paymentMasterAdd(this.createForm.value, this.createForm.get('CountryId').value).subscribe(
                data => {
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
                    Helpers.DisplayMsg({ status: 'error', msg: 'Something when wrong.Please try later' })
                    Helpers.setLoading(false);
                });
        }

    }


}
