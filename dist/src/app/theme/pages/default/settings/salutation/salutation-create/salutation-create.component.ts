import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Helpers } from '../../../../../../helpers';

import { SalutationService } from '../salutation.service';

@Component({
    selector: 'app-salutation-create',
    templateUrl: './salutation-create.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class SalutationCreateComponent implements OnInit {

    createForm: any;
    formError = false;

    constructor(public formBuilder: FormBuilder, private _salutationService: SalutationService) {
        this.formInit();
    }

    ngOnInit() {
    }

    formInit() {
        this.createForm = this.formBuilder.group({
            Salutation: ['', Validators.required],
        });
    }

    create() {
        this.formError = true;
        if (!this.createForm.valid) {
            Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
        } else {
            Helpers.setLoading(true);
            this._salutationService.SalutationAdd(this.createForm.value).subscribe(
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
