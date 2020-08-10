import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Helpers } from "../../../../../helpers";

@Injectable()
export class PaymentService {

    constructor(private http: Http, private helper: Helpers) { }

    paymentMaster(param) {
        return this.http.get(this.helper.ApiBaseUrl + 'settings/payment/master-data', this.helper.jwt()).map((response: Response) => response.json());
    }

    paymentMasterAdd(param, countryId) {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let params = param;

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + currentUser.access_token)

        return this.http.post(this.helper.ApiBaseUrl + 'settings/payment/add/' + countryId, JSON.stringify(params), { headers: headers })
            .map((response: Response) => response.json());
    }

    paymentFrequency() {
        return this.http.get(this.helper.ApiBaseUrl + 'settings/recurring-frequency/list', this.helper.jwt()).map((response: Response) => response.json());
    }

}
