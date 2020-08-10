import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Helpers } from '../../../../../../helpers';

import { FamilyRelationshipService } from '../family-relationship.service';

@Component({
    selector: 'app-family-relationship-edit',
    templateUrl: './family-relationship-edit.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class FamilyRelationshipEditComponent implements OnInit {

    createForm: any;
    formError = false;
    routeParams: any;

    constructor(public formBuilder: FormBuilder, private _familyService: FamilyRelationshipService, private activeRoute: ActivatedRoute) {
        this.formInit();
    }

    ngOnInit() {
        this.routeParams = this.activeRoute.snapshot.params;
    }

    formInit() {
        this.createForm = this.formBuilder.group({
            RelationshipName: ['', Validators.required],
        });
    }

    getEditState() {
        Helpers.setLoading(true);
        return this._familyService.familyEdit(this.routeParams.FamilyId).subscribe(
            data => {
                Helpers.setLoading(false);
                let family = data.data.family
                this.createForm = this.formBuilder.group({
                    RelationshipName: [family.RelationshipName, Validators.required],
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
            this._familyService.familyUpdate(this.createForm.value, this.routeParams.FamilyId).subscribe(
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
