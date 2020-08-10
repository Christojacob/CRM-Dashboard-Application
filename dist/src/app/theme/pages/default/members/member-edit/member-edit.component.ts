import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Helpers } from '../../../../../helpers';

import { MemberService } from '../member.service';
import { CountryService } from '../../settings/country/country.service';
import { SalutationService } from '../../settings/salutation/salutation.service';
import { LanguageService } from '../../settings/language/language.service';
import { StateService } from '../../settings/state/state.service';

@Component({
    selector: 'app-member-edit',
    templateUrl: './member-edit.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class MemberEditComponent implements OnInit {

    countryList: any;
    salutationList: any;
    languageList: any;
    createForm: any;
    formError = false;
    routeParams: any;
    photoUrl: any;
    mprofile: any = {
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
    mAddress: any;
    AddressForm: any;
    stateList: any;
    AddressCreate = true;
    editAddressId: any = 0;

    @ViewChild('fileInput') fileInput: ElementRef;

    constructor(
        public formBuilder: FormBuilder,
        private _memberService: MemberService,
        private _countryService: CountryService,
        private _salutationService: SalutationService,
        private _languageService: LanguageService,
        private activeRoute: ActivatedRoute,
        private helper: Helpers,
        private _stateService: StateService
    ) {
        this.formInit();
        this.AddressFormInit();
    }

    ngOnInit() {
        this.routeParams = this.activeRoute.snapshot.params;
        this.getPrimaryCountry();
        this.getSalutation();
        this.getLanguage();
        this.getAddress();
    }

    formInit() {
        this.createForm = this.formBuilder.group({
            Email: ['', Validators.required],
            UserName: ['', Validators.required],
            Password: ['', Validators.required],
            ConfirmPassword: ['', Validators.required],
            SalutationId: [''],
            FirstName: ['', Validators.required],
            LastName: ['', Validators.required],
            Photo: [''],
            CountryId: [''],
            MobileNumber: ['', Validators.required],
            SecondaryNumber: [''],
            Gender: [''],
            PreferedLanguageOfCommunication: [''],
            PreferedModeOfContact: ['', Validators.required],
            EmailOptutFlag: [''],
            CallOptoutFlag: [''],
            Status: ['', Validators.required],
            PhotoRemovedFlag: [0]
        });
    }

    AddressFormInit() {
        this.AddressForm = this.formBuilder.group({
            AddressType: [''],
            Address1: ['', Validators.required],
            Address2: ['', Validators.required],
            City: ['', Validators.required],
            CountryId: [0],
            StateId: [0],
            Zip: ['', Validators.required]
        });
    }


    getPrimaryCountry() {

        return this._countryService.allCountry({}).subscribe(
            data => {
                this.countryList = data.data.CountryList;
                this.getEditMember()
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

    countryUpdate() {
        console.log(this.AddressForm.get('CountryId').value)
        return this._stateService.allState(this.AddressForm.get('CountryId').value).subscribe(
            data => {
                this.stateList = data.data;
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }


    getEditMember() {
        Helpers.setLoading(true);
        return this._memberService.memberEdit(this.routeParams.MemberId).subscribe(
            data => {
                Helpers.setLoading(false);
                let currentUser = JSON.parse(localStorage.getItem('currentUser'));
                this.photoUrl = this._memberService.memberPhoto(this.routeParams.MemberId);
                this.mprofile = data.data.MemberProfile
                let country = this.mprofile.CountryId != null ? this.mprofile.CountryId : 0;
                let salutation = this.mprofile.SalutationId != null ? this.mprofile.SalutationId : 0;
                let emailOutput = this.mprofile.EmailOptutFlag != null ? this.mprofile.EmailOptutFlag : 0;
                let callOptoutFlag = this.mprofile.CallOptoutFlag != null ? this.mprofile.CallOptoutFlag : 0;
                let language = this.mprofile.PreferedLanguageOfCommunication != null ? this.mprofile.PreferedLanguageOfCommunication : 0;
                let status = this.mprofile.Status != null ? this.mprofile.Status : 0;
                this.createForm = this.formBuilder.group({
                    Email: [this.mprofile.Email, Validators.required],
                    UserName: [this.mprofile.UserName, Validators.required],
                    SalutationId: [salutation],
                    FirstName: [this.mprofile.FirstName, Validators.required],
                    LastName: [this.mprofile.LastName, Validators.required],
                    Photo: [''],
                    CountryId: [country],
                    MobileNumber: [this.mprofile.MobileNumber, Validators.required],
                    SecondaryNumber: [this.mprofile.SecondaryNumber],
                    Gender: [this.mprofile.Gender],
                    PreferedLanguageOfCommunication: [language],
                    PreferedModeOfContact: [this.mprofile.PreferedModeOfContact, Validators.required],
                    EmailOptutFlag: [emailOutput],
                    CallOptoutFlag: [callOptoutFlag],
                    Status: [status, Validators.required],
                    PhotoRemovedFlag: [0]
                });
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    update() {
        console.log(this.createForm.value);
        this.formError = true;
        if (!this.createForm.valid) {
            Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
        } else {
            Helpers.setLoading(true);
            this._memberService.memberUpdate(this.createForm.value, this.routeParams.MemberId).subscribe(
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

    getAddress() {
        return this._memberService.memberAddressList(this.routeParams.MemberId).subscribe(
            data => {
                this.mAddress = data.data;
            },
            error => {
                console.log("Some error tiggered" + error)
            })
    }

    salutationFind(satutationId) {
        if (this.salutationList != undefined && this.salutationList.find(salutation => salutation.RecordId === satutationId) != undefined) {
            return this.salutationList.find(salutation => salutation.RecordId === satutationId).Salutation;
        } else {
            return "";
        }
    }

    countryFind(countryId) {
        if (this.countryList != undefined && this.countryList.find(country => country.Id === countryId) != undefined) {
            return this.countryList.find(country => country.Id === countryId).Name;
        } else {
            return "";
        }
    }

    languageFind(langId) {
        if (this.languageList != undefined && this.languageList.find(language => language.RecordID === langId) != undefined) {
            return this.languageList.find(language => language.RecordID === langId).Language;
        } else {
            return "";
        }
    }

    findGender(type) {
        if (type == 1) {
            return "Male";
        } else if (type == 2) {
            return "Female";
        } else {
            return "";
        }
    }

    contactFind(type) {
        if (type == 1) {
            return "Email";
        } else if (type == 2) {
            return "Phone";
        } else if (type == 3) {
            return "SMS";
        } else {
            return "";
        }
    }

    addressEdit(id) {
        this.editAddressId = id;
        this.AddressFormInit()
        Helpers.setLoading(true);
        return this._memberService.memberAddressEdit(id).subscribe(
            data => {
                this.AddressCreate = false;
                Helpers.setLoading(false);
                console.log(data)
                let eAddress = data.data.AddressDetails
                this.AddressForm = this.formBuilder.group({
                    AddressType: [eAddress.AddressType],
                    Address1: [eAddress.Address1, Validators.required],
                    Address2: [eAddress.Address2, Validators.required],
                    City: [eAddress.City, Validators.required],
                    CountryId: [eAddress.CountryId],
                    StateId: [eAddress.StateId],
                    Zip: [eAddress.Zip, Validators.required]
                });
                this.countryUpdate()

            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    addressSave() {
        if (this.AddressCreate == true) {
            this.formError = true;
            if (!this.AddressForm.valid) {
                Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
            } else {
                Helpers.setLoading(true);
                this._memberService.memberAddressCreate(this.AddressForm.value, this.routeParams.MemberId).subscribe(
                    data => {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg(data);
                        this.getAddress()
                        this.AddressForm.reset()
                        this.AddressFormInit();
                        this.formError = false;
                    },
                    error => {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg({ status: 'error', msg: 'Something when wrong.Please try later' })
                    });
            }
        } else {
            console.log(this.AddressForm.value);
            this.formError = true;
            if (!this.AddressForm.valid) {
                Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
            } else {
                Helpers.setLoading(true);
                this._memberService.memberAddressUpdate(this.AddressForm.value, this.editAddressId).subscribe(
                    data => {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg(data);
                        this.getAddress()
                        this.AddressForm.reset()
                        this.AddressFormInit();
                        this.formError = false;
                        this.AddressCreate = true;
                    },
                    error => {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg({ status: 'error', msg: 'Something when wrong.Please try later' })
                    });
            }
        }
    }

    resetAddress() {
        console.log("reset address form")
        this.AddressCreate = true;
        this.AddressFormInit();
        this.editAddressId = 0;
    }

}
