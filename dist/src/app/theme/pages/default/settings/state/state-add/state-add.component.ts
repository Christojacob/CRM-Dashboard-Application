import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Helpers } from '../../../../../../helpers';

import { StateService } from '../state.service';
import { CountryService } from '../../country/country.service';


@Component({
    selector: 'app-state-add',
    templateUrl: './state-add.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class StateAddComponent implements OnInit, AfterViewInit {

    countryList: any;
    createForm: any;
    formError = false;

    constructor(public formBuilder: FormBuilder, private _stateService: StateService, private _countryService: CountryService) {
        this.formInit();
    }

    ngOnInit() {
        this.getAllCountry();
    }

    ngAfterViewInit() {
    }

    formInit() {
        this.createForm = this.formBuilder.group({
            Name: ['', Validators.required],
            StateCode: ['', Validators.required],
            CountryId: [0, Validators.required],
        });
    }

    getAllCountry() {

        return this._countryService.allCountry({}).subscribe(
            data => {
                this.countryList = data.data.CountryList;
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
            this._stateService.stateAdd(this.createForm.value).subscribe(
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
