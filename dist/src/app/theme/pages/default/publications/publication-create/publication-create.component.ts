import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { Helpers } from '../../../../../helpers';
import { MemberService } from '../../members/member.service';
import { CountryService } from '../../settings/country/country.service';
import { StateService } from '../../settings/state/state.service';
import { SalutationService } from '../../settings/salutation/salutation.service';
import { LanguageService } from '../../settings/language/language.service';
import { PublicationService } from '../publication.service';
import { PaymentService } from '../../settings/payment/payment.service';
import { SubApplicationService } from '../../settings/sub-application/sub-application.service';

declare let $: any;
declare var mWizard: any;

interface CountryItem {
    CountryId: string,
    Name: string
}

interface LocalAdmin {
    UserId: string,
    Name: string
}

@Component({
    selector: 'app-publication-create',
    templateUrl: './publication-create.component.html',
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
    }`
    ],
})

export class PublicationCreateComponent implements OnInit, AfterViewInit, CountryItem, LocalAdmin {
    CountryId: string;
    UserId: string;
    Name: string;
    countryList: any;
    PrimaryCountryList: any;
    subapplicationList: any;
    localAdminArray: any[][] = [[]];
    EditionAdminArray: any = [];
    localCountryArray: any[] = [];
    localAdminCount = 0;
    localAdminItems: any = [];
    availableCountryList: CountryItem[] = [];
    frequencyList: any = [];
    categoryList: any;
    stateList: any;
    LocalAdminList: any = [];
    salutationList: any;
    languageList: any;
    createForm: any;
    formError = false;
    memberId: any = '1534251052OH6';


    // AddressForm: any;

    @ViewChild('fileInput') fileInput: ElementRef;

    constructor(public _subApplication: SubApplicationService, public _paymentService: PaymentService, public _publicationService: PublicationService, public formBuilder: FormBuilder, private _memberService: MemberService, private _countryService: CountryService, private _stateService: StateService, private _salutationService: SalutationService, private _languageService: LanguageService) {
        this.formInit();
        // this.AddressFormInit();
    }


    ngAfterViewInit() {

        this._publicationService.AdminSelect2();
        this._publicationService.EditionAdminSelect2();
        let mm = this;

        $('.m_select_local_admin').on('select2:select', function(e) {
            let index = $(this).attr('id');
            $(this).select2('data').selected = true;
            let rmdata = $(this).select2('data');
            mm.localAdminArray[index].push({ UserId: rmdata[0].id, Name: rmdata[0].FirstName });
            let AdminFormValues = mm.createForm.value.LocalAdmins;
            console.log(JSON.stringify(mm.localAdminArray));
        });

        $('.m_select_edition_admin').on('select2:select', function(e) {
            let index = $(this).attr('id');
            $(this).select2('data').selected = true;
            let rmdata = $(this).select2('data');
            mm.EditionAdminArray.push({ UserId: rmdata[0].id, Name: rmdata[0].FirstName });
            console.log(JSON.stringify(mm.localAdminArray));
        });


    }
    add_admin_country(i, countryID) {
        console.log('yes');
        this.localCountryArray[i] = countryID;
        console.log(this.localCountryArray);
    }
    removeAdmin(i,j){
        this.localAdminArray[i].splice(j, 1);

    }

    removeEditionAdmin(i) {
        console.log(i);
        delete this.EditionAdminArray[i];
        // console.log(this.EditionAdminArray[i]);
    }

    ngOnInit() {
        let _self = this;


        this._subApplication.SubApplicationList().subscribe(
            data => {
                this.subapplicationList = data.data;
                let subdata = [];
                for (let i = 0; i < this.subapplicationList.length; i++) {
                    subdata.push({ id: this.subapplicationList[i].RecordID, text: this.subapplicationList[i].SubApplication })
                }

                $('#subapplications').select2({
                    placeholder: "Eg: Shalom Tidings",
                    data: subdata
                });

            },
            error => {
                console.log("Some error tiggered" + error)
            });


        this.getAllCountry();
        this.getPrimaryCountry();
        this.getFrequencies();
        this.getSalutation();
        this.getLanguage();
        // this.getAddress();
        setTimeout(() => {
            $.fn.datepicker.defaults.format = "yyyy-mm-dd";
            Helpers.datepickerInit($('#dob'));
        }, 0);
        this.getCategories();


    }
    getCategories() {
        this._publicationService.getCategories().subscribe(data => {
            this.categoryList = data.data.CategoryList;
        },
            error => {
                console.log("Some error tiggered" + error);
                alert('no');
            });
    }

    getFrequencies() {
        this._publicationService.getFrequency().subscribe(data => {
            this.frequencyList = data.data;
        },
            error => {
                console.log("Some error tiggered" + error);
                alert('no');
            });

    }

    

    formInit() {
        this.createForm = this.formBuilder.group({
            IsCreateAccount: [0],
            PublicationCategoryId: [0, Validators.required],
            Description: [''],
            Language: [0, Validators.required],
            EditionCountryId: ['', Validators.required],
            PublicationFrequencyId: [0, Validators.required],
            Logo: [''],
            AvailableCountries: [0],
            EditionAdmins: [],
            LocalCountryId: [0],
            LocalAdmins: this.formBuilder.array([this.createAdmin()]),
            SubApplications: ['']
        });
    }
    createAdmin(): FormGroup {
        return this.formBuilder.group({
            CountryId: [0],
            Admins: [''],
        })
    }

    addAdmin(i) {
        // console.log(JSON.stringify(this.createForm.controls['LocalAdmins'].value));
        this.LocalAdminList = (this.createForm.controls['LocalAdmins']) as FormArray;
        // this.PaymentOptions = this.createForm.get('PaymentOptions') as FormArray;
        // console.log(this.LocalAdminList);
        this.LocalAdminList.push(this.createAdmin());
        this.getPrimaryCountry();
        this.getAllCountry();
        setTimeout(() => {
            this._publicationService.AdminSelect2();
        }, 0);
        let mm = this;
        mm.localAdminArray.push([]);

        setTimeout(() => {
            $('.m_select_local_admin').on('select2:select', function(e) {
                console.log('yes')
                let index = $(this).attr('id');
                $(this).select2('data').selected = true;
                let rmdata = $(this).select2('data');
                mm.localAdminArray[index].push({ UserId: rmdata[0].id, Name: rmdata[0].FirstName });
                let AdminFormValues = mm.createForm.value.LocalAdmins;
                console.log(JSON.stringify(mm.localAdminArray));
            });


        }, 0);

    }

    // onaddAdmin(){
    //     $('.m_select_edition_admin').on('select2:select', function(e) {
    //         let rmdata = $('.localadminform:last .m_select_edition_admin').select2('data');
    //         console.log('rmdata='+rmdata);
    //     });
    // }

    onAddAvailableCountry(countryID) {
        let index = this.countryList.findIndex(x => x.Id === countryID);
        let name = this.countryList[index].Name;
        this.availableCountryList.push({
            "CountryId": countryID,
            Name: name
        });
        // $('#AvailableCountries').prop('selectedIndex',0);
    }

    getAllCountry() {
        return this._countryService.allCountry({}).subscribe(
            data => {
                this.countryList = data.data.CountryList;
                setTimeout(() => {
                    $('.m_select_country').selectpicker();
                }, 0);
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    getPrimaryCountry() {
        return this._countryService.allCountry('PrimaryCountryOnly=1').subscribe(
            data => {
                this.PrimaryCountryList = data.data.CountryList;
                console.log(this.PrimaryCountryList);
                setTimeout(() => {
                    $('.m_select_primary_country').selectpicker();
                }, 0);
            },
            error => {
                console.log("Some error tiggered" + error);
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
                console.log(this.languageList);
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }


    fileChange(event) {
        if (event.target.files.length > 0) {
            let file = event.target.files[0];
            console.log(file);
           this.createForm.get('Logo').setValue(file)
        }
    }


    create() {
        let subapplication = $("#subapplications").val();
        let subapplication_param = [];
        for (let i = 0; i < subapplication.length; i++) {
            subapplication_param[i] = { ApplicationId: subapplication[i] }
        }
        this.createForm.value.SubApplications = JSON.stringify(subapplication_param);
        this.localAdminItems= [];

        for (let j = 0; j < this.localAdminArray.length; j++) {
            this.localAdminItems.push({
                CountryId: this.localCountryArray[j],
                Admins: this.localAdminArray[j]
            })
        }
        let LocalAdminParams = JSON.stringify(this.localAdminItems);
        this.createForm.value.EditionAdmins = JSON.stringify(this.EditionAdminArray);
        // console.log(this.createForm.value.EditionAdmins);
        
        // this.formError = true;
        // let dobDate = $('#dob').val();
        // this.createForm.controls.Dob.setValue(dobDate);
        if (!this.createForm.valid) {
            Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
        } else {
            Helpers.setLoading(true);
            this._publicationService.publicationCreate(this.createForm.value, LocalAdminParams, JSON.stringify(this.availableCountryList)).subscribe(
                data => {
                    if (data.status == 'success') {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg(data);
                        this.createForm.reset();
                        this.formInit();
                        this.formError = false;
                        this.memberId = data.data.MemberId;
                    } else {
                        Helpers.setLoading(false);
                        Helpers.DisplayMsg(data);
                    }

                },
                error => {
                    Helpers.DisplayMsg({ status: 'error', msg: 'Something when wrong.Please try later' });
                    Helpers.setLoading(false);
                });
        }
    }

}
