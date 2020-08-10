import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, NgForm } from '@angular/forms';
import { Helpers } from '../../../../../helpers';
import { CommonCrudService } from '../../../../../_services/common-crud.service';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import * as _ from "lodash";
import { DonationsService } from '../donations.service';
import { CountryService } from '../../settings/country/country.service';
import { StateService } from '../../settings/state/state.service';

declare let $: any;

@Component({
    selector: 'app-donation-process',
    templateUrl: './donation-process.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [
        `
    .m-option__title, .m-option__focus{
      width: auto !important;
    }
    .m-option__focus{
      text-align: right !important;
    }
    `
    ],
})
export class DonationProcessComponent implements OnInit {

    rangeArray: any;
    memberId: any;
    memberCountryId: any;
    CauseLists: any;
    PaymentMethods: any = [];
    CauseIndex: any = 0;
    PaymentOptionIndex: any = 0;
    PaymentMethodIndex: any = 0;
    PaymentOptionValueIndex: any = 0;
    Amount: any = 0;
    AnyAmount: any;
    PaymentFields: any = {
        BillingAddress: {
            Address1: "",
            Address2: "",
            AddressType: 1,
            City: "",
            CountryId: "",
            StateId: "",
            Zip: ""
        }
    };
    CheckImage: any;
    credit_step_1: any = true;
    countryList: any;
    stateList: any;
    frequencyList: any;

    @ViewChild('AnyAmountInput') private elementRef: ElementRef;

    @ViewChild('fileInput') fileInput: ElementRef;

    constructor(public formBuilder: FormBuilder, private helper: Helpers, private _crud: CommonCrudService, private http: Http, private _donation: DonationsService,
        private _countryService: CountryService,
        private _stateService: StateService
    ) {
        this.rangeArray = _.range(1, 29);
        this.getCountry();
        this.getfrequencyList();
    }

    ngOnInit() {
        let _self = this;
        this._donation.CauseProcessSelect2();

        $('#choose_member').on('select2:select', function(e) {
            let rmdata = $('#choose_member').select2('data');
            _self.memberCountryId = rmdata[0].CountryID;
            _self.memberId = $(this).val();
            _self._crud.getData({ url: 'donation/causes/' + _self.memberId })
                .subscribe(data => {
                    _self.CauseLists = data.Causes;
                    setTimeout(() => { $('.m_selectpicker').selectpicker('val', 0); }, 0)
                    _self.CauseChanged();
                }, error => { console.log("Some error tiggered" + error) });

        });
    }

    getCountry() {
        return this._countryService.allCountry({}).subscribe(
            data => {
                this.countryList = data.data.CountryList;
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    getfrequencyList() {
        this._crud.getData({ url: 'settings/recurring-frequency/list' })
            .subscribe(data => {
                console.log(data);
                this.frequencyList = data.RecurringFrequencyList;
            }, error => {
                console.log("Some error tiggered" + error)
            });
    }

    countryUpdate() {
        return this._stateService.allState(this.PaymentFields.BillingAddress.CountryId).subscribe(
            data => {
                this.stateList = data.data;
                setTimeout(() => {
                    $('.m_select_state').selectpicker('refresh');
                }, 0);
            },
            error => {
                console.log("Some error tiggered" + error)
            });
    }

    getClientToken() {
        return this._donation.getBrainTreeToken(this.PaymentMethods[this.PaymentMethodIndex].CountryPaymentSettings.Id)
            .map((res: any) => {
                return res.json().data.ClientToken;
            })
    }

    CauseChanged() {
        let CauseId = this.CauseLists[this.CauseIndex].CauseId;
        this._crud.getData({ url: `donation/fetch-payment-methods/${this.memberId}/${CauseId}` })
            .subscribe(data => {
                this.PaymentMethods = data.AvailablePaymentMethods;
            }, error => {
                console.log("Some error tiggered" + error)
            });
    }

    PaymentMethodChange(j) {
        this.PaymentMethodIndex = j
        switch (this.PaymentMethods[j].UniqueName) {
            case 'credit_or_debt':
                this.credit_step_1 = true;
                setTimeout(() => {
                    $('.m_select_day').selectpicker('val', 0);
                    $('.m_select_country').selectpicker();
                    $('.m_select_state').selectpicker();
                }, 0);
                this.getSavedCard();
                break;
            case 'ach':
                this.getSavedCard();
                setTimeout(() => {
                    $('.m_select_day').selectpicker('val', 0);
                    $('.m_select_accountype').selectpicker('val', 'checking');
                    $('.m_select_country').selectpicker();
                    $('.m_select_state').selectpicker();
                }, 0);
                break;
            case 'bank_transfer':
                setTimeout(() => {
                    Helpers.datepickerInit($('#bank_transfer_received'));
                    $('.m_select_day').selectpicker('val', 0);
                }, 0);
                break;
            case 'check':
                setTimeout(() => {
                    Helpers.datepickerInit($('#paymentReceivedDate'));
                    Helpers.datepickerInit($('#checkDate'));
                    $('.m_select_day').selectpicker('val', 0);
                }, 0);
                break;
            case 'cash':
                setTimeout(() => {
                    Helpers.datepickerInit($('#cashReceivedDate'));
                    $('.m_select_day').selectpicker('val', 0);
                }, 0);
                break;
        }

    }

    nextStep(current, step) {
        if (step == 2) {
            this.PaymentMethodIndex = 0;
            this.getSavedCard();
            setTimeout(() => {
                $('.m_select_day').selectpicker('val', 0);
                $('.m_select_country').selectpicker();
                $('.m_select_state').selectpicker();
                $('.m_select_accountype').selectpicker('val', 'Checking');
            }, 0);
            this.PaymentFields.BillingAddress.CountryId = this.memberCountryId;
            this.countryUpdate();
        }
        if (current == 1 && (!this.Amount || this.Amount <= 0)) {
            Helpers.DisplayMsg({ msg: 'Please select the amount', status: 'error' })
        } else {
            $(".tab-pane").removeClass('in active');
            $("#m_tabs_12_" + step).addClass('in active');
            $(".m-tabs__item a").removeClass('active show');
            $('.m-tabs__item a[data*="m_tabs_12_' + step + '"]').addClass('active show');
        }
    }

    getSavedCard() {
        this._crud.getData({
            url: 'donation/fetch-saved-cards/' + this.memberId,
            params: {
                CauseId: this.CauseLists[this.CauseIndex].CauseId,
                PaymentMethodId: this.PaymentMethods[this.PaymentMethodIndex].Id
            }
        }).subscribe(data => {
            console.log('saveddata', data);
        })
    }

    fileChange(event) {
        if (event.target.files.length > 0) {
            this.CheckImage = event.target.files[0];
        }
    }

    createPurchase(nonce: string, chargeAmount: number) {

        this.PaymentFields.Nonce = nonce;
        let selectedCause = this.CauseLists[this.CauseIndex];
        let selectedPaymentOption = selectedCause.PaymentOptions[this.PaymentOptionIndex];
        let selectedPaymentOptionValue = selectedPaymentOption.PaymentOptionValues[this.PaymentOptionValueIndex];
        let params = {
            Amount: chargeAmount,
            CausePaymentOptionValueId: selectedPaymentOptionValue.CausePaymentOptionValue,
            CausePaymentOptionId: selectedPaymentOption.Id,
            Frequency: selectedPaymentOptionValue.RecurringFrequencyId,
            CurrencyISOCode: selectedPaymentOption.CurrencyCode,
            PaymentProcessParams: {
                PaymentMethodId: this.PaymentMethods[this.PaymentMethodIndex].Id,
                CountryPaymentGatewaySettingId: this.PaymentMethods[this.PaymentMethodIndex].CountryPaymentSettings.PaymentGatewayId,
                PaymentFields: this.PaymentFields
            }
        }

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + currentUser.access_token)

        // return this.http.post(this.helper.ApiBaseUrl + 'donation/process/' + this.memberId + '/' + selectedCause.CauseId, params, { headers: headers })
        //     .subscribe((response: Response) => {
        //         Helpers.setLoading(false);
        //         const res = response.json();
        //         if (res.status == "success") {
        //             // return res.data;
        //             Helpers.DisplayMsg(res);
        //         } else {
        //             Helpers.DisplayMsg(res);
        //         }
        //     });
        return this.http.post(this.helper.ApiBaseUrl + 'donation/process/' + this.memberId + '/' + selectedCause.CauseId, params, { headers: headers })
            .map((res: any) => {
                return res.json().data;
            })
    }

    createPayment() {

        switch (this.PaymentMethods[this.PaymentMethodIndex].UniqueName) {
            case 'credit_or_debt':

                break;
            case 'ach':

                break;
            case 'bank_transfer':
                this.PaymentFields.ReceivedDate = $('#bank_transfer_received').val();
                break;
            case 'check':
                this.PaymentFields.PaymentReceivedDate = $('#paymentReceivedDate').val();
                this.PaymentFields.CheckDate = $('#checkDate').val();
                this.PaymentFields.CheckImage = this.CheckImage;
                break;
            case 'cash':
                this.PaymentFields.ReceivedDate = $('#cashReceivedDate').val();
                break;
        }

        let selectedCause = this.CauseLists[this.CauseIndex];
        let selectedPaymentOption = selectedCause.PaymentOptions[this.PaymentOptionIndex];
        let selectedPaymentOptionValue = selectedPaymentOption.PaymentOptionValues[this.PaymentOptionValueIndex];
        let params = {
            Amount: selectedPaymentOptionValue.Amount,
            CausePaymentOptionValueId: selectedPaymentOptionValue.CausePaymentOptionValue,
            CausePaymentOptionId: selectedPaymentOption.Id,
            Frequency: selectedPaymentOptionValue.RecurringFrequencyId,
            CurrencyISOCode: selectedPaymentOption.CurrencyCode,
            PaymentProcessParams: {
                PaymentMethodId: this.PaymentMethods[this.PaymentMethodIndex].Id,
                CountryPaymentGatewaySettingId: this.PaymentMethods[this.PaymentMethodIndex].CountryPaymentSettings.PaymentGatewayId,
                PaymentFields: this.PaymentFields
            }
        }
        console.log(params);
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + currentUser.access_token)

        return this.http.post(this.helper.ApiBaseUrl + 'donation/process/' + this.memberId + '/' + selectedCause.CauseId, params, { headers: headers })
            .subscribe((response: Response) => {
                Helpers.setLoading(false);
                const res = response.json();
                if (res.status == "success") {
                    // return res.data;
                    Helpers.DisplayMsg(res)
                } else {
                    Helpers.DisplayMsg(res)
                }
            });
    }
}
