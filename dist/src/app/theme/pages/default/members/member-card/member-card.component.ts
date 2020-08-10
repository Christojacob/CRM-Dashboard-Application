import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-member-card',
    templateUrl: './member-card.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class MemberCardComponent implements OnInit {

    savePaymentMethod: any = 'credit_or_debt';
    cardPaymentCountry: any = 0;

    constructor() { }

    ngOnInit() {
    }
    // addCardInit() {
    //     $('#m_modal_7').modal('show');
    // }
    // getClientToken() {
    //     return this._donation.getBrainTreeToken(this.cardPaymentCountry)
    //         .map((res: any) => {
    //             return res.json().data.ClientToken;
    //         })
    // }

}
