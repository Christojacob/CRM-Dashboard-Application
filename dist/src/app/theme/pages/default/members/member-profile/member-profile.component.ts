import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';

import { CommonCrudService } from '../../../../../_services/common-crud.service';
import { ActivatedRoute } from '@angular/router';
import { SalutationService } from '../../settings/salutation/salutation.service';

@Component({
    selector: 'app-member-profile',
    templateUrl: './member-profile.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class MemberProfileComponent implements OnInit {

    routeParams: any;
    memberId: any;
    mProfile: any;
    memberEdit: any = false;
    createForm: any;
    salutationList: any;
    mProfileEdit: any;


    constructor(
        private activeRoute: ActivatedRoute,
        private _crud: CommonCrudService,
        public formBuilder: FormBuilder,
        public _salutationService: SalutationService
    ) { }

    ngOnInit() {
        this.routeParams = this.activeRoute.snapshot.params;
        this.memberId = this.routeParams.MemberId;
        this.getMember();
        this.getSalutation();
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

    getSalutation() {
        return this._salutationService.SalutationList().subscribe(
            data => {
                this.salutationList = data.data;
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    memberEditUpdate() {
        this.memberEdit = !this.memberEdit;
        if (this.memberEdit) {
            this._crud.getData({ url: `backend/member-user/edit/${this.routeParams.MemberId}` })
                .subscribe(data => {
                    this.mProfileEdit = data.MemberProfile;
                    this.createForm = this.formBuilder.group({
                        IsCreateAccount: [this.mProfileEdit],
                        FirstName: [this.mProfileEdit.FirstName, Validators.required],
                        LastName: [this.mProfileEdit.LastName, Validators.required],
                        CountryId: [this.mProfileEdit.CountryId],
                        MobileNumber: [this.mProfileEdit.MobileNumber, Validators.required],
                        SecondaryNumber: [this.mProfileEdit.FirstName.SecondaryNumber],
                        Gender: [this.mProfileEdit.Gender],
                        PreferedLanguageOfCommunication: [0],
                        PreferedModeOfContact: [],
                        CallOptoutFlag: [this.mProfileEdit.CallOptoutFlag],
                        EmailOptutFlag: [this.mProfileEdit.EmailOptutFlag],
                        Dob: [this.mProfileEdit.Dob],
                        Status: [this.mProfileEdit.Status],
                        Email: [this.mProfileEdit.Email],
                        UserName: [this.mProfileEdit.UserName],
                        SalutationId: [this.mProfileEdit.SalutationId],
                    });
                },
                error => {
                    console.log("Some error tiggered" + error)
                })
        }
    }


}
