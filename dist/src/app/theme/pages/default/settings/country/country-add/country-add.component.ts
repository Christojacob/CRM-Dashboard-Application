import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Helpers } from '../../../../../../helpers';

import { CountryService } from '../country.service';

@Component({
    selector: 'app-country-add',
    templateUrl: './country-add.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class CountryAddComponent implements OnInit, AfterViewInit {

    countryList: any;
    createForm: any;
    formError = false;

    constructor(public formBuilder: FormBuilder, private _countryService: CountryService) {
        this.formInit();
    }

    ngOnInit() {
        this.getPrimaryCountry();
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

    create() {
        this.formError = true;
        if (!this.createForm.valid) {
            Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
        } else {
            Helpers.setLoading(true);
            this._countryService.countryAdd(this.createForm.value).subscribe(
                data => {
                    if (data.status == 'success') {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg(data)
                        this.getPrimaryCountry();
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
