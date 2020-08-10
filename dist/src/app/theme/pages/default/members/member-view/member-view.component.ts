import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Helpers } from '../../../../../helpers';

import { CommonCrudService } from '../../../../../_services/common-crud.service';
import { SalutationService } from '../../settings/salutation/salutation.service';
import { MemberService } from '../member.service';
import { CountryService } from '../../settings/country/country.service';
import { StateService } from '../../settings/state/state.service';
import { DonationsService } from '../../donations/donations.service';

declare let $: any;

@Component({
    selector: 'app-member-view',
    templateUrl: './member-view.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [

        `.m-nav.m-nav--hover-bg .m-nav__item > .m-nav__link,
    .m-nav.m-nav--hover-bg .m-nav__item > .m-nav__link .m-nav__link-text,
    .m-nav.m-nav--hover-bg .m-nav__item > .m-nav__link .m-nav__link-icon{
      transition: all .3s ease-in-out;
    }
    .m-nav.m-nav--hover-bg .m-nav__item > .m-nav__link.active{
      background-color: #f7f8fa;
    }
    .m-nav.m-nav--hover-bg .m-nav__item > .m-nav__link.active .m-nav__link-text,
    .m-nav.m-nav--hover-bg .m-nav__item > .m-nav__link.active .m-nav__link-icon{
      color: #716aca;
    }
    .nav.m-nav {
      display:block !important;
    }
    `
    ],
})
export class MemberViewComponent implements OnInit {

    routeParams: any;
    memberId: any;
    mProfile: any;
    createForm: any;
    memberCreateForm: any;
    addressCreateForm: any;
    formError = false;
    salutationList: any;
    relationshipList: any;
    countryList: any;
    stateList: any;
    addressList: any;
    savePaymentMethod: any = 'credit_or_debt';
    primaryCountryList: any;
    cardPaymentCountry: any = 0;

    constructor(
        private helper: Helpers,
        private activeRoute: ActivatedRoute,
        private _crud: CommonCrudService,
        public formBuilder: FormBuilder,
        private _salutationService: SalutationService,
        private _memberService: MemberService,
        private _countryService: CountryService,
        private _stateService: StateService,
        private _donation: DonationsService
    ) {
        this.formInit();
        this.memberFormInit();
        this.addressFormInit();
        this.getCountry();
        this.getPrimaryCountry();
    }

    ngOnInit() {
        this.routeParams = this.activeRoute.snapshot.params;
        this.memberId = this.routeParams.MemberId;
        this.getMember();
        this.getRelationship();
        this.getSalutation();
        this.getAddress();
        setTimeout(() => {
            $.fn.datepicker.defaults.format = "yyyy-mm-dd";
            Helpers.datepickerInit($('#dob'));
            $('.m_select_country').selectpicker();
            $('.m_select_state').selectpicker();
        }, 0);
    }

    fileChange(event) {
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            this.createForm.get('Photo').setValue(file)
        }
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

    getRelationship() {
        return this._crud.getData({ url: 'settings/family-relationship' }).subscribe(
            data => {
                this.relationshipList = data;
            },
            error => {
                console.log("Some error tiggered" + error)
            }
        )
    }

    getMember() {
        this._crud.getData({ url: `backend/member-user/view/${this.routeParams.MemberId}` }).subscribe(
            data => {
                this.mProfile = data.MemberProfile;
            },
            error => {
                console.log("Some error tiggered" + error)
            })
    }

    getClientToken() {
        return this._donation.getBrainTreeToken(this.cardPaymentCountry)
            .map((res: any) => {
                return res.json().data.ClientToken;
            })
    }

    addInit() {
        $('#m_modal_5').modal('show');
    }

    addAddressInit() {
        $('#m_modal_6').modal('show');
    }

    addCardInit() {
        $('#m_modal_7').modal('show');
    }

    formInit() {
        this.createForm = this.formBuilder.group({
            RelationshipId: [0, Validators.required],
            SalutationId: [0, Validators.required],
            FirstName: ['', Validators.required],
            LastName: ['', Validators.required],
            MobileNumber: ['', Validators.required],
            SecondaryNumber: ['', Validators.required],
            Gender: ['', Validators.required],
            Dob: ['', Validators.required],
            Photo: ['', Validators.required],
            Email: ['', Validators.required]
        });
    }

    memberFormInit() {
        this.memberCreateForm = this.formBuilder.group({
            IsCreateAccount: [0, Validators.required],
            FirstName: ['', Validators.required],
            LastName: ['', Validators.required],
            CountryId: [0],
            MobileNumber: ['', Validators.required],
            SecondaryNumber: [''],
            Gender: [0],
            PreferedLanguageOfCommunication: [0],
            PreferedModeOfContact: [1, Validators.required],
            CallOptoutFlag: [''],
            EmailOptutFlag: [''],
            Dob: [''],
            Status: [1],
            Photo: [''],
            Email: ['', Validators.required],
            UserName: ['', Validators.required],
            SalutationId: [0],
        });
    }

    addressFormInit() {
        this.addressCreateForm = this.formBuilder.group({
            AddressType: [0, Validators.required],
            Address1: ['', Validators.required],
            Address2: ['', Validators.required],
            City: ['', Validators.required],
            CountryId: [0, Validators.required],
            StateId: [0, Validators.required],
            Zip: ['', Validators.required]
        });
    }

    create() {
        this.formError = true;
        let dobDate = $('#dob').val();
        this.createForm.controls.Dob.setValue(dobDate);
        if (!this.createForm.valid) {
            Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
        } else {
            Helpers.setLoading(true);
            this._memberService.familyMemberCreate(this.createForm.value, this.routeParams.MemberId).subscribe(
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

    getPrimaryCountry() {
        return this._countryService.allCountry({ PrimaryCountryOnly: 1 }).subscribe(
            data => {
                this.primaryCountryList = data.data.CountryList;
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    getCountry() {
        return this._countryService.allCountry({}).subscribe(
            data => {
                this.countryList = data.data.CountryList;
                setTimeout(() => {
                    $('.m_select_country').selectpicker('refresh');
                })
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    getAddress() {
        return this._crud.getData({ url: `backend/member-user/address/${this.routeParams.MemberId}` })
            .subscribe(
            data => {
                this.addressList = data;
            },
            error => {
                console.log("Some error tiggered" + error)
            })
    }

    countryUpdate() {
        return this._stateService.allState(this.addressCreateForm.get('CountryId').value).subscribe(
            data => {
                this.stateList = data.data;
                setTimeout(() => {
                    $('.m_select_state').selectpicker('refresh');
                }, 0);
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    addressCreate() {
        $('#m_modal_6').modal('hide');
        this.formError = true;
        if (!this.addressCreateForm.valid) {
            Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
        } else {
            Helpers.setLoading(true);
            this._memberService.addressMemberCreate(this.addressCreateForm.value, this.routeParams.MemberId).subscribe(
                data => {
                    if (data.status == 'success') {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg(data)
                        this.addressCreateForm.reset()
                        this.addressFormInit();
                        this.formError = false;
                        $('#m_modal_6').modal('hide');
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
