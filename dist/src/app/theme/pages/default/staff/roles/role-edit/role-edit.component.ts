
import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Helpers } from '../../../../../../helpers';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../../members/member.service';
import { CountryService } from '../../../settings/country/country.service';
import { StateService } from '../../../settings/state/state.service';
import { SalutationService } from '../../../settings/salutation/salutation.service';
import { LanguageService } from '../../../settings/language/language.service';
import { StaffService } from '../staff.service'

declare let $: any;
declare var mWizard: any;

@Component({
    selector: 'app-role-edit',
    templateUrl: './role-edit.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class RoleEditComponent implements OnInit, AfterViewInit {

    countryList: any;
    stateList: any;
    salutationList: any;
    routeParams: any;
    languageList: any;
    createForm: any;
    formError = false;
    memberId: any;
    sprofile: any = {
        CallOptoutFlag: null,
        CountryId: "",
        Email: "",
        EmailOptutFlag: null,
        FirstName: "",
        Gender: null,
        Id: "",
        IsPrimaryMember: 1,
        LastName: "",
        MobileNumber: "",
        Photo: "",
        PreferedLanguageOfCommunication: "",
        PreferedModeOfContact: 1,
        SalutationId: "",
        SecondaryNumber: "",
        Status: null,
        UserName: ""
    };

    // AddressForm: any;

    @ViewChild('fileInput') fileInput: ElementRef;

    constructor(private activeRoute: ActivatedRoute, public _staffService: StaffService, public formBuilder: FormBuilder, private _memberService: MemberService, private _countryService: CountryService, private _stateService: StateService, private _salutationService: SalutationService, private _languageService: LanguageService) {
        this.formInit();
        // this.AddressFormInit();
    }

    ngAfterViewInit() {


    }

    ngOnInit() {
        this.routeParams = this.activeRoute.snapshot.params;
        this.getPrimaryCountry();
        this.getSalutation();
        this.getLanguage();
        this.getEditStaff()
        // this.getAddress();
        setTimeout(() => {
            $.fn.datepicker.defaults.format = "yyyy-mm-dd";
            Helpers.datepickerInit($('#dob'));
        }, 0);
    }


    formInit() {
        this.createForm = this.formBuilder.group({
            FirstName: ['', Validators.required],
            LastName: ['', Validators.required],
            CountryId: [0, Validators.required],
            MobileNumber: ['', Validators.required],
            SecondaryNumber: [''],
            Gender: [0],
            Dob: [''],
            Photo: [''],
            Email: ['', Validators.required],
            SalutationId: [0],
            Status: ['', Validators.required],
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

    getEditStaff() {
        Helpers.setLoading(true);
        return this._staffService.staffEdit(this.routeParams.StaffId).subscribe(
            data => {
                Helpers.setLoading(false);
                let currentUser = JSON.parse(localStorage.getItem('currentUser'));
                this.sprofile = data.data.StaffDetails
                let country = this.sprofile.Country.Id != null ? this.sprofile.Country.Id : 0;
                let salutation = this.sprofile.Salutation.Id != null ? this.sprofile.Salutation.Id : 0;
                let status = this.sprofile.Status != null ? this.sprofile.Status : 0;
                console.log('status='+status);
                this.createForm = this.formBuilder.group({
                    Email: [this.sprofile.Email, Validators.required],
                    SalutationId: [salutation],
                    Dob: [''],  
                    FirstName: [this.sprofile.FirstName, Validators.required],
                    LastName: [this.sprofile.LastName, Validators.required],
                    Photo: [''],
                    CountryId: [country],
                    MobileNumber: [this.sprofile.MobileNumber, Validators.required],
                    SecondaryNumber: [this.sprofile.SecondaryNumber],
                    Gender: [this.sprofile.Gender],
                    PhotoRemovedFlag: [0],
                    Status: [status, Validators.required],
                });
                
            },
            error => {
                console.log("Some error tiggered" + error)
            });
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

    staffUpdate() {
        this.formError = true;
        let dobDate = $('#dob').val();
        this.createForm.controls.Dob.setValue(dobDate);
        if (!this.createForm.valid) {
            Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
        } else {
            Helpers.setLoading(true);
            this._staffService.staffUpdate(this.createForm.value, this.routeParams.StaffId).subscribe(
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