import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Helpers } from '../../../../../helpers';

import { MemberService } from '../../members/member.service';
import { CountryService } from '../../settings/country/country.service';
import { StateService } from '../../settings/state/state.service';
import { SalutationService } from '../../settings/salutation/salutation.service';
import { LanguageService } from '../../settings/language/language.service';

declare let $: any;
declare var mWizard: any;

@Component({
    selector: 'app-price-management-combo',
    templateUrl: './price-management-combo.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [
        `i.la.la-close {
      font-size: 10px !important;
      margin-left: 4px !important;
    }
    .m-form .m-form__group {
      padding: 20px 0px;
    }
    .col-xl-4 {
      -webkit-box-flex: 0;    
      padding-right: 70px;
    }
    .custom-row-repeat.row {
      margin-bottom: 10px;
    }
    .custom-form-group-headings.row {
      padding-top: 20px;
      margin-bottom: 0px;
    }
    .custom-form-group-headings.row label {
      font-weight: 500;
      padding-left: 20px;
    }`
    ],
})

export class PriceManagementComboComponent implements OnInit, AfterViewInit {

    countryList: any;
    stateList: any;
    salutationList: any;
    languageList: any;
    createForm: any;
    formError = false;
    memberId: any = '1534251052OH6';

    // AddressForm: any;

    @ViewChild('fileInput') fileInput: ElementRef;

    constructor(public formBuilder: FormBuilder, private _memberService: MemberService, private _countryService: CountryService, private _stateService: StateService, private _salutationService: SalutationService, private _languageService: LanguageService) {
        this.formInit();
        // this.AddressFormInit();
    }

    ngAfterViewInit() {


    }

    ngOnInit() {
        this.getPrimaryCountry();
        this.getSalutation();
        this.getLanguage();
        // this.getAddress();
        setTimeout(() => {
            $.fn.datepicker.defaults.format = "yyyy-mm-dd";
            Helpers.datepickerInit($('#dob'));
        }, 0);
    }


    formInit() {
        this.createForm = this.formBuilder.group({
            IsCreateAccount: [0],
            FirstName: ['', Validators.required],
            LastName: ['', Validators.required],
            CountryId: [0],
            MobileNumber: ['', Validators.required],
            SecondaryNumber: [''],
            Gender: [0],
            PreferedLanguageOfCommunication: [0],
            PreferedModeOfContact: [1],
            CallOptoutFlag: [''],
            EmailOptutFlag: [''],
            Dob: [''],
            Status: [1],
            Photo: [''],
            Email: [''],
            UserName: [''],
            SalutationId: [0],
        });
    }

    getPrimaryCountry() {
        return this._countryService.allCountry({}).subscribe(
            data => {
                this.countryList = data.data.CountryList;
                setTimeout(() => {
                    $('.m_select_country').selectpicker();
                }, 0);
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    getSalutation() {
        return this._salutationService.SalutationList().subscribe(
            data => {
                this.salutationList = data.data;
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    getLanguage() {
        return this._languageService.LanguageList().subscribe(
            data => {
                this.languageList = data.data;
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }


    fileChange(event) {
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            this.createForm.get('Photo').setValue(file)
        }
    }


    create() {
        this.formError = true;
        let dobDate = $('#dob').val();
        this.createForm.controls.Dob.setValue(dobDate);
        if (!this.createForm.valid) {
            Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
        } else {
            Helpers.setLoading(true);
            this._memberService.memberCreate(this.createForm.value).subscribe(
                data => {
                    if (data.status == 'success') {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg(data)
                        this.createForm.reset()
                        this.formInit();
                        this.formError = false;
                        this.memberId = data.data.MemberId;
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
