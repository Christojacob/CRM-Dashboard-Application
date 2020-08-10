import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { Router } from "@angular/router";

declare let $: any;

@Component({
    selector: 'app-publications-add',
    templateUrl: './publications-add.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [
        `i.la.la-close {
      font-size: 10px !important;
      margin-left: 4px !important;
    }
    .m-form .m-form__group {
      padding: 20px 0px;
    }
    .col-xl-4 {
      -webkit-box-flex: 0;    
      padding-right: 70px;
    }.custom-row-repeat.row {
      margin-bottom: 10px;
    }
    .custom-form-group-headings.row {
      padding-top: 20px;
      margin-bottom: 0px;
    }
    .custom-form-group-headings.row label {
      font-weight: 500;
      padding-left: 20px;
    }`
    ],
})

export class PublicationsAddComponent implements OnInit, AfterViewInit {
    adv = true;
    optionField: any = Helpers.datatableOptions();
    hidenFields: any;
    constructor(private helper: Helpers, private router: Router) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        let mm = this;
        let apiUrl = this.helper.ApiBaseUrl;
        
    }    

}
