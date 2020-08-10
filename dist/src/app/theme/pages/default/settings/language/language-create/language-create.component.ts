import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Helpers } from '../../../../../../helpers';

import { LanguageService } from '../language.service';

@Component({
    selector: 'app-language-create',
    templateUrl: './language-create.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class LanguageCreateComponent implements OnInit {

    createForm: any;
    formError = false;

    constructor(public formBuilder: FormBuilder, private _languageService: LanguageService) {
        this.formInit();
    }

    ngOnInit() {
    }

    formInit() {
        this.createForm = this.formBuilder.group({
            Language: ['', Validators.required],
            Code: ['', Validators.required],
        });
    }

    create() {
        this.formError = true;
        if (!this.createForm.valid) {
            Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
        } else {
            Helpers.setLoading(true);
            this._languageService.LanguageAdd(this.createForm.value).subscribe(
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
