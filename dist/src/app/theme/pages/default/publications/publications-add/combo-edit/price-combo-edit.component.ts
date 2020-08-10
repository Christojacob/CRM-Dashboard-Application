import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormArray,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
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
    selector: 'app-price-combo-edit',
    templateUrl: './price-combo-edit.component.html',
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

export class PriceComboEditComponent implements OnInit, AfterViewInit {

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
    routeParams: any;

    // AddressForm: any;

    @ViewChild('fileInput') fileInput: ElementRef;

    constructor(public formBuilder: FormBuilder, private _memberService: MemberService, private _countryService: CountryService, private _stateService: StateService, private _salutationService: SalutationService, private _languageService: LanguageService, private _publicationService:PublicationService,private activeRoute: ActivatedRoute, private _router:Router) {
        this.formInit();
        // this.AddressFormInit();
    }

    ngAfterViewInit() {


    }

    ngOnInit() {
        this.routeParams = this.activeRoute.snapshot.params;
        this.getFormEdit();
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

    getFormEdit(){
        Helpers.setLoading(true);
        return this._publicationService.PublicationSingleEdit(this.routeParams.comboEdit).subscribe(
            data => {
                Helpers.setLoading(false);
                
                this.createForm = this.formBuilder.group({
                    Edition: [data.data.PriceList.PublicationDetails.EditionCountryId, Validators.required],
                    Publication: [data.data.PriceList.PublicationDetails.PublicationId],
                    PriceGrid: this.formBuilder.array([
                       
                     ]),
                });
                this.publicationId=[];
                for(let i=0; i<data.data.PriceList.PublicationDetails.PublicationId.length; i++){
                    this.publicationId.push({"Id":data.data.PriceList.PublicationDetails.PublicationId[i].Id});
                }         
                this.getPublication(data.data.PriceList.PublicationDetails.EditionCountryId);
                this.editPriceGridField(data.data.PriceList.PriceGrid);
                this.getCountry(this.publicationId);

            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    //price grid
    editinitPriceGridField(PriceGrid) : FormGroup
    {
         let controls= this.formBuilder.group({
            CountryId : [PriceGrid.CountryId, Validators.required],
            CurrencyISOCode : [PriceGrid.CurrencyCode, Validators.required],
            PriceList:this.formBuilder.array([
               
             ]),

        });
        this.editPriceListFiled(controls.controls.PriceList,PriceGrid.PriceList);
        return controls;
    }
    editPriceGridField(PriceGrid) : void
    {
       const control = <FormArray>this.createForm.controls.PriceGrid;
       for (let i = 0; i < PriceGrid.length; i++) {
       control.push(this.editinitPriceGridField(PriceGrid[i]));
       }   
       this.formInitChildPriceGrid();
    }
    //price list

    editinitPriceListFiled(PriceList): FormGroup{
         let controls= this.formBuilder.group({
        Duration:[PriceList.Duration, Validators.required],
        DurationType : [PriceList.DurationType, Validators.required],
        CouponCode : [PriceList.CouponCode],
        PriceSplit:this.formBuilder.array([
            
         ])
    });
    this.editPriceSplitFiled(controls.controls.PriceSplit,PriceList.PriceSpilt);
    return controls;
}

    editPriceListFiled(control,PriceList) : void
    {
        for (let i = 0; i < PriceList.length; i++) {
              control.push(this.editinitPriceListFiled(PriceList[i]));
        }
        this.formInitChildPriceGrid();
    }

    //price spilit
    editinitPriceSplitFiled(PriceSplit): FormGroup{
            return this.formBuilder.group({
                PublicationId:[PriceSplit.PublicationId, Validators.required],
                Format : [PriceSplit.Format, Validators.required],
                Price : [PriceSplit.Price, Validators.required],
        });
    }

    editPriceSplitFiled(control,PriceSplit) : void
    {
        for (let i = 0; i < PriceSplit.length; i++) {
        control.push(this.editinitPriceSplitFiled(PriceSplit[i]));
       }
        this.formInitChildPriceGrid();
    }
    //end edit nested


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



   // nested child price split
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
                    var subdata=[];
                    for(var i=0;i<mm.publicationList.length;i++){
                       
                        subdata.push({id:mm.publicationList[i].Id,text:mm.publicationList[i].PublicationName})
                    }
                    var setData=[];
                    for(let i=0;i<mm.publicationId.length;i++){
                        setData.push(mm.publicationId[i].Id)
                    }

                    $('.m_select_language').select2({
                        placeholder: "Publication",
                        data:subdata
                    }).on('select2:select', function(e) {
                            var selectedData=[];
                            for(var i in $(this).select2("val")){                             
                                selectedData.push({"Id":$(this).select2("val")[i]});
                            }
                            mm.publicationId=selectedData;
                            mm.getCountry(selectedData);
                    }).on('select2:unselect', function(e) {
                            var selectedData=[];
                            for(var i in $(this).select2("val")){
                                selectedData.push({"Id":$(this).select2("val")[i]});
                            }
                            mm.publicationId=selectedData;
                            mm.getCountry(selectedData);
                    });

                    $('.m_select_language').val(setData).trigger("change");
                    //mm.getCountry(mm.publicationId)

                    $('.m_select_publcation_ch').selectpicker('refresh');
                }, 0);
                
            },
            error => {
                console.log("Some error tiggered" + error)
            });
        
        
    }
    getCountry(format){
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
            this._publicationService.publicationComboUpdate(this.createForm.value,this.publicationId,this.routeParams.comboEdit).subscribe(
                data => {
                    if (data.status == 'success') {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg(data)
                        this._router.navigate(['/publications/price_management/'])
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
