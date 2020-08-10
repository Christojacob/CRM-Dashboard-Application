import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Helpers } from '../../../../../../helpers';

import { StateService } from '../state.service';
import { CountryService } from '../../country/country.service';

@Component({
    selector: 'app-state-edit',
    templateUrl: './state-edit.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class StateEditComponent implements OnInit, AfterViewInit {

    countryList: any;
    createForm: any;
    formError = false;
    routeParams: any;

    constructor(public formBuilder: FormBuilder, private _stateService: StateService, private _countryService: CountryService, private activeRoute: ActivatedRoute) {
        this.formInit();
    }

    ngOnInit() {
        this.getAllCountry();
        this.routeParams = this.activeRoute.snapshot.params;
    }

    ngAfterViewInit() {

    }

    formInit() {
        this.createForm = this.formBuilder.group({
            Name: ['', Validators.required],
            StateCode: ['', Validators.required],
            CountryId: [0],
        });
    }

    getAllCountry() {

        return this._countryService.allCountry({}).subscribe(
            data => {
                this.countryList = data.data.CountryList;
                this.getEditState()
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    getEditState() {
        Helpers.setLoading(true);
        return this._stateService.stateEdit(this.routeParams.StateId).subscribe(
            data => {
                Helpers.setLoading(false);
                let state = data.data.state
                let country = state.CountryId != null ? state.CountryId : 0;
                this.createForm = this.formBuilder.group({
                    Name: [state.Name, Validators.required],
                    StateCode: [state.StateCode, Validators.required],
                    CountryId: [country],
                });
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    update() {
        this.formError = true;
        if (!this.createForm.valid) {
            Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
        } else {
            Helpers.setLoading(true);
            this._stateService.stateUpdate(this.createForm.value, this.routeParams.StateId).subscribe(
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
    }

}
