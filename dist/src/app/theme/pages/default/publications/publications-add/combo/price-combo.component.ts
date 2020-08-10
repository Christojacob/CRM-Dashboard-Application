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
    selector: 'app-price-combo',
    templateUrl: './price-combo.component.html',
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

export class PriceComboComponent implements OnInit, AfterViewInit {

    countryList: any;
    currencyList: any;
    primaryCountry:any;
    publicationList:any;
    stateList: any;
    salutationList: any;
    languageList: any;
    createForm: FormGroup;
    formError = false;
    publicationId:any=[];
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
            $('.m_select_available_country,.m_select_publcation_ch,.m_select_format').selectpicker();
            $('.m_select_language').select2({
                placeholder: "Publication"
            });
           
        }, 0);
    }

    formInitChildPriceGrid(){
        setTimeout(() => {
        $('.m_select_available_country').selectpicker();
        $('.m_select_currency,.m_select_publcation_ch,.m_select_format').selectpicker('refresh');
        }, 0);
    }


    formInit() {
      let newForm= this.createForm = this.formBuilder.group({
            Edition: ['', Validators.required],
            Publication: [''],
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
            CouponCode : [''],
            PriceSplit:this.formBuilder.array([
                this.initPriceSplitFiled()
                
             ])
        });
    }

    addPriceListFiled(control) : void
    {
        control.push(this.initPriceListFiled());
        this.formInitChildPriceGrid();
    }
    removePriceListFiled(control,j:number) : void
    {
        control.removeAt(j);
    }

    //PriceSplit
    initPriceSplitFiled(): FormGroup{
            return this.formBuilder.group({
                PublicationId:['', Validators.required],
                Format : ['', Validators.required],
                Price : ['', Validators.required],
        });
    }

    addPriceSplitFiled(control) : void
    {
        control.push(this.initPriceSplitFiled());
        this.formInitChildPriceGrid();
    }
    removePriceSplitFiled(control,j:number) : void
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
        let mm=this;
        return this._publicationService.getPublication({EditionCountryId:countryId}).subscribe(
            data => {
                this.publicationList = data.data.PublicationList;
                setTimeout(() => {
                    $('.m_select_language').select2({
                        placeholder: "Publication"
                    }).on('select2:select', function(e) {
                            var selectedData=[];
                            for(var i in $(this).select2("val")){
                                var s =$(this).select2("val")[i];                                
                                selectedData.push({"Id":s.match(/'([^']+)'/)[1]});
                            }
                            mm.publicationId=selectedData;
                           mm.getCountry(selectedData);
                            //mm.createForm.controls['Publication'].setValue(selectedData);
                    }).on('select2:unselect', function(e) {
                            var selectedData=[];
                            for(var i in $(this).select2("val")){
                                var s =$(this).select2("val")[i];                                
                                selectedData.push({"Id":s.match(/'([^']+)'/)[1]});
                            }
                            mm.publicationId=selectedData;
                           mm.getCountry(selectedData);
                            //mm.createForm.controls['Publication'].setValue(selectedData);
                    });
                    $('.m_select_publcation_ch').selectpicker('refresh');
                }, 0);
            },
            error => {
                console.log("Some error tiggered" + error)
            });
        
        
    }
    getCountry(format){
        console.log(format)
        return this._publicationService.getAvailablePublicationCountry({"PublicationId":JSON.stringify(format),"PriceType":2}).subscribe(
            data => {
                if(data.status=="error"){
                    this.countryList =[];
                }else{
                this.countryList = data.data.AvaialbleCoutryList;
                 }
                setTimeout(() => {
                    $('.m_select_available_country').selectpicker('refresh');
                }, 0);
            },
            error => {
                this.countryList =[];
                $('.m_select_available_country').selectpicker('refresh');
                console.log("Some error tiggered" + error)
            });
    }

    getCurrency(){
        return this._publicationService.getCurrency().subscribe(
            data => {
                this.currencyList = data.data;
                setTimeout(() => {
                    $('.m_select_currency').selectpicker('refresh');
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
        console.log(this.createForm.value);
        if (!this.createForm.valid) {
            Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
        } else {
            Helpers.setLoading(true);
            this._publicationService.publicationComboAdd(this.createForm.value,this.publicationId).subscribe(
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
