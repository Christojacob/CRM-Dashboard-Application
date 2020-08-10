import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Helpers } from '../../../../../helpers';

import { MemberService } from '../member.service';
import { CountryService } from '../../settings/country/country.service';
import { StateService } from '../../settings/state/state.service';
import { SalutationService } from '../../settings/salutation/salutation.service';
import { LanguageService } from '../../settings/language/language.service';

declare let $: any;
declare var mWizard: any;

@Component({
    selector: 'app-member-create',
    templateUrl: './member-create.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class MemberCreateComponent implements OnInit, AfterViewInit {

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

    // AddressFormInit() {
    //   this.AddressForm = this.formBuilder.group({
    //     AddressType: [''],
    //     Address1: ['', Validators.required],
    //     Address2: ['', Validators.required],
    //     City: ['', Validators.required],
    //     CountryId: [0],
    //     StateId: [0],
    //     Zip: ['', Validators.required]
    //   });
    // }

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

    // getAddress() {
    //   return this._memberService.memberAddressList(this.memberId).subscribe(
    //     data => {
    //       console.log(data)
    //     },
    //     error => {
    //       console.log("Some error tiggered" + error)
    //     });
    // }

    fileChange(event) {
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            this.createForm.get('Photo').setValue(file)
        }
    }

    // countryUpdate() {
    //   console.log(this.AddressForm.get('CountryId').value)
    //   return this._stateService.allState(this.AddressForm.get('CountryId').value).subscribe(
    //     data => {
    //       this.stateList = data.data;
    //     },
    //     error => {
    //       console.log("Some error tiggered" + error)
    //     });
    // }

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

    // AddAddress() {
    //   this.formError = true;
    //   if (!this.AddressForm.valid) {
    //     Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
    //   } else {
    //     Helpers.setLoading(true);
    //     this._memberService.memberAddressCreate(this.AddressForm.value, this.memberId).subscribe(
    //       data => {
    //         if (data.status == 'success') {
    //           Helpers.setLoading(false);
    //           Helpers.DisplayMsg(data)
    //           this.AddressForm.reset()
    //           this.AddressFormInit();
    //           this.formError = false;
    //         } else {
    //           Helpers.setLoading(false);
    //           Helpers.DisplayMsg(data)
    //         }
    //       },
    //       error => {
    //         Helpers.DisplayMsg({ status: 'error', msg: 'Something when wrong.Please try later' })
    //         Helpers.setLoading(false);
    //       });
    //   }
    // }

}
