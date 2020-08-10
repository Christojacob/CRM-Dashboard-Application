import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Helpers } from '../../../../../../helpers';

import { LanguageService } from '../language.service';

@Component({
    selector: 'app-language-edit',
    templateUrl: './language-edit.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class LanguageEditComponent implements OnInit {

    createForm: any;
    formError = false;
    routeParams: any;

    constructor(public formBuilder: FormBuilder, private _languageService: LanguageService, private activeRoute: ActivatedRoute) {
        this.formInit();
    }

    ngOnInit() {
        this.routeParams = this.activeRoute.snapshot.params;
        this.getEditLanguage()
    }

    formInit() {
        this.createForm = this.formBuilder.group({
            Language: ['', Validators.required],
            Code: ['', Validators.required],
        });
    }

    getEditLanguage() {
        Helpers.setLoading(true);
        return this._languageService.LanguageEdit(this.routeParams.LanguageId).subscribe(
            data => {
                Helpers.setLoading(false);
                let Language = data.data.Language;
                this.createForm = this.formBuilder.group({
                    Language: [Language.Language, Validators.required],
                    Code: [Language.Code, Validators.required],
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
            this._languageService.LanguageUpdate(this.createForm.value, this.routeParams.LanguageId).subscribe(
                data => {

                    if (data.status == 'success') {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg(data)
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
