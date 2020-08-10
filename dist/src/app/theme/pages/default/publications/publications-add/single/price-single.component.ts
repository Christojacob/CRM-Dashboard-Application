import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormArray,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Helpers } from '../../../../../../helpers';

import { MemberService } from '../../../members/member.service';
import { CountryService } from '../../../settings/country/country.service';
import { StateService } from '../../../settings/state/state.service';
import { SalutationService } from '../../../settings/salutation/salutation.service';
import { LanguageService } from '../../../settings/language/language.service';
import { PublicationService } from '../../publication.service';

declare let $: any;
declare var mWizard: any;

@Component({
    selector: 'app-price-single',
    templateUrl: './price-single.component.html',
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

export class PriceSingleComponent implements OnInit, AfterViewInit {

    countryList: any;
    currencyList: any;
    primaryCountry:any;
    publicationList:any;
    stateList: any;
    salutationList: any;
    languageList: any;
    createForm: FormGroup;
    formError = false;
    memberId: any = '1534251052OH6';

    // AddressForm: any;

    @ViewChild('fileInput') fileInput: ElementRef;

    constructor(public formBuilder: FormBuilder, private _memberService: MemberService, private _countryService: CountryService, private _stateService: StateService, private _salutationService: SalutationService, private _languageService: LanguageService, private _publicationService:PublicationService) {
        this.formInit();
        // this.AddressFormInit();
    }

    ngAfterViewInit() {


    }

    ngOnInit() {
        this.getPrimaryCountry();
        this.getCurrency();
        this.getSalutation();
        this.getLanguage();
        
        // this.getAddress();
        setTimeout(() => {
            $.fn.datepicker.defaults.format = "yyyy-mm-dd";
            Helpers.datepickerInit($('#dob'));
            $('.m_select_language,.m_select_available_country').selectpicker();
        }, 0);
    }

    formInitChildPriceGrid(){
        setTimeout(() => {
        $('.m_select_available_country').selectpicker();
        }, 0);
    }


    formInit() {
      this.createForm = this.formBuilder.group({
            Edition: ['', Validators.required],
            Publication: ['', Validators.required],
          //  CountryId: ['', Validators.required],
          //  Currency: ['', Validators.required],
            PriceGrid: this.formBuilder.array([
                this.initPriceGridField()
             ]),
        });
        
    }

    initPriceGridField() : FormGroup
    {
        return this.formBuilder.group({
            CountryId : ['', Validators.required],
            CurrencyISOCode : ['', Validators.required],
            PriceList:this.formBuilder.array([
                this.initPriceListFiled()
             ]),

        });
    }
    
    addPriceGridField() : void
    {
       const control = <FormArray>this.createForm.controls.PriceGrid;
       control.push(this.initPriceGridField());
       this.formInitChildPriceGrid();
    }

    removePriceGridField(i : number) : void
   {
      const control = <FormArray>this.createForm.controls.PriceGrid;
      control.removeAt(i);
   }



   // nested child
   initPriceListFiled(): FormGroup{
            return this.formBuilder.group({
            Duration:['', Validators.required],
            DurationType : ['', Validators.required],
            Format : ['', Validators.required],
            Price : ['', Validators.required],
            CouponCode : ['', Validators.required],
        });
    }

    addPriceListFiled(control) : void
    {
        control.push(this.initPriceListFiled());
    }
    removePriceListFiled(control,j:number) : void
    {
        control.removeAt(j);
    }


    

    getPrimaryCountry() {
        return this._countryService.allCountry({PrimaryCountryOnly:1}).subscribe(
            data => {
                this.primaryCountry = data.data.CountryList;
                setTimeout(() => {
                    $('.m_select_country').selectpicker();
                }, 0);
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    getPublication(countryId){
        return this._publicationService.getPublication({EditionCountryId:countryId}).subscribe(
            data => {
                this.publicationList = data.data.PublicationList;
                setTimeout(() => {
                    $('.m_select_language').selectpicker('refresh');
                }, 0);
            },
            error => {
                console.log("Some error tiggered" + error)
            });
        
        
    }
    getCountry(publicationId){
        console.log(publicationId);
        let format:any=[];

        format.push({"Id":publicationId});
        
        return this._publicationService.getAvailablePublicationCountry({"PublicationId":JSON.stringify(format),"PriceType":1}).subscribe(
            data => {
                this.countryList = data.data.AvaialbleCoutryList;
                setTimeout(() => {
                    $('.m_select_available_country').selectpicker('refresh');
                }, 0);
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    getCurrency(){
        return this._publicationService.getCurrency().subscribe(
            data => {
                this.currencyList = data.data;
                setTimeout(() => {
                    $('.m_select_currency').selectpicker();
                }, 0);
            },
            error => {
                console.log("Some error tiggered" + error)
            });
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

    getLanguage() {
        return this._languageService.LanguageList().subscribe(
            data => {
                this.languageList = data.data;
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }


    fileChange(event) {
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            this.createForm.get('Photo').setValue(file)
        }
    }


    create() {
        this.formError = true;
        if (!this.createForm.valid) {
            Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
        } else {
            Helpers.setLoading(true);
            this._publicationService.publicationSingleAdd(this.createForm.value).subscribe(
                data => {
                    if (data.status == 'success') {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg(data)
                        this.createForm.reset()
                        this.formInit();
                        this.formError = false;
                        this.memberId = data.data.MemberId;
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
