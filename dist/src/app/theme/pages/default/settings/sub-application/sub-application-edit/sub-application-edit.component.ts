import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Helpers } from '../../../../../../helpers';

import { SubApplicationService } from '../sub-application.service';

@Component({
    selector: 'app-sub-application-edit',
    templateUrl: './sub-application-edit.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class SubApplicationEditComponent implements OnInit {

    createForm: any;
    formError = false;
    routeParams: any;

    constructor(public formBuilder: FormBuilder, private _subApplicationService: SubApplicationService, private activeRoute: ActivatedRoute) {
        this.formInit();
    }

    ngOnInit() {
        this.routeParams = this.activeRoute.snapshot.params;
        this.getEditSubApplication();
    }

    formInit() {
        this.createForm = this.formBuilder.group({
            Name: ['', Validators.required],
            WebSiteUrl: ['', Validators.required],
        });
    }

    getEditSubApplication() {
        Helpers.setLoading(true);
        return this._subApplicationService.SubApplicationEdit(this.routeParams.SubApplicationId).subscribe(
            data => {
                Helpers.setLoading(false);
                let subapplication = data.data.SubApplication
                this.createForm = this.formBuilder.group({
                    Name: [subapplication.SubApplicationName, Validators.required],
                    WebSiteUrl: [subapplication.WebSiteUrl, Validators.required],
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
            this._subApplicationService.SubApplicationUpdate(this.createForm.value, this.routeParams.SubApplicationId).subscribe(
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
