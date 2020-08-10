import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Helpers } from '../../../../../../helpers';

import { SubApplicationService } from '../sub-application.service';

@Component({
    selector: 'app-sub-application-create',
    templateUrl: './sub-application-create.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class SubApplicationCreateComponent implements OnInit {

    createForm: any;
    formError = false;

    constructor(public formBuilder: FormBuilder, private _subApplicationService: SubApplicationService) {
        this.formInit();
    }

    ngOnInit() {
    }

    formInit() {
        this.createForm = this.formBuilder.group({
            Name: ['', Validators.required],
            WebSiteUrl: ['', Validators.required],
        });
    }

    create() {
        this.formError = true;
        if (!this.createForm.valid) {
            Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
        } else {
            Helpers.setLoading(true);
            this._subApplicationService.SubApplicationAdd(this.createForm.value).subscribe(
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

}
