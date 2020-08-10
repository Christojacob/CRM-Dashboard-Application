import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Helpers } from '../../../../../../helpers';

import { SalutationService } from '../salutation.service';

@Component({
    selector: 'app-salutation-edit',
    templateUrl: './salutation-edit.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class SalutationEditComponent implements OnInit {

    createForm: any;
    formError = false;
    routeParams: any;

    constructor(public formBuilder: FormBuilder, private _salutationService: SalutationService, private activeRoute: ActivatedRoute) {
        this.formInit();
    }

    ngOnInit() {
        this.routeParams = this.activeRoute.snapshot.params;
        this.getEditSalutation()
    }

    formInit() {
        this.createForm = this.formBuilder.group({
            Salutation: ['', Validators.required],
        });
    }

    getEditSalutation() {
        Helpers.setLoading(true);
        return this._salutationService.SalutationEdit(this.routeParams.SalutationId).subscribe(
            data => {
                Helpers.setLoading(false);
                let salutation = data.data.salutation
                this.createForm = this.formBuilder.group({
                    Salutation: [salutation.Salutation, Validators.required],
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
            this._salutationService.SalutationUpdate(this.createForm.value, this.routeParams.SalutationId).subscribe(
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
                    Helpers.setLoading(false);
                    Helpers.DisplayMsg({ status: 'error', msg: 'Something when wrong.Please try later' })
                });
        }
    }

}
