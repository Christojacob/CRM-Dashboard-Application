import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Helpers } from '../../../../../../helpers';
import { Router } from "@angular/router";


import { CountryService } from '../country.service';

declare let $: any;

@Component({
    selector: 'app-primary-country-add',
    templateUrl: './primary-country-add.component.html',
    encapsulation: ViewEncapsulation.None
})

export class PrimaryCountryAddComponent implements OnInit {

    countryList: any;
    createForm: any;
    formError = false;
    countryLinkedList: any;

    constructor(public formBuilder: FormBuilder, private router: Router, private _countryService: CountryService) {
        this.formInit();
    }

    ngOnInit() {
        this.getCountry();
        this.getLinkedCountry();
    }

    formInit() {
        this.createForm = this.formBuilder.group({
            PrimaryCountryId: [0],
            LinkedCountry: this.formBuilder.array([])
        });
    }

    getCountry() {

        return this._countryService.primaryCountryPossibility().subscribe(
            data => {
                this.countryList = data.data;
                setTimeout(() => {
                    $('.m_select_country').selectpicker();
                }, 0);
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    getLinkedCountry() {
        return this._countryService.linkedCountryPossibility("").subscribe(
            data => {
                this.countryLinkedList = data.data;
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    onChange(id, isChecked: boolean) {
        const LinkedCountry = this.createForm.get('LinkedCountry') as FormArray;

        if (isChecked) {
            LinkedCountry.push(this.formBuilder.group({
                Id: id
            }));
        } else {
            let index = LinkedCountry.controls.findIndex(x => x.value == id)
            LinkedCountry.removeAt(index);
        }
    }

    create() {
        console.log(this.createForm.value);
        this.formError = true;
        if (!this.createForm.valid) {
            Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
        } else {
            Helpers.setLoading(true);
            this._countryService.PrimaryCountryAdd(this.createForm.value).subscribe(
                data => {
                    if (data.status == 'success') {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg(data)
                        this.createForm.reset()
                        this.formInit();
                        this.getCountry();
                        this.getLinkedCountry();
                        this.formError = false;
                        this.router.navigateByUrl('/setting/primary-country/edit/' + data.data.PrimaryCountryId);

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
