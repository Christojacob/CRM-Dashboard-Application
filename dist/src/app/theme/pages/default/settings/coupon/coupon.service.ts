import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Helpers } from "../../../../../helpers";

@Injectable()
export class CouponService {

    constructor(private http: Http, private helper: Helpers) { }

    dateConvertSet(value: string) {
        let d = new Date(value);
        return [d.getFullYear().toString(), (d.getMonth() + 1).toString(), d.getDate().toString()].join('-');
     }
     dateConvertGet(value: string) {
        let d = new Date(value);
        return [(d.getMonth() + 1).toString(), d.getDate().toString(),d.getFullYear().toString()].join('/');
     }
    couponList(param) {
        let options = this.helper.jwt();
        options.params = param;
        return this.http.get(this.helper.ApiBaseUrl + 'settings/coupon', options).map((response: Response) => response.json());
    }

       

    couponAdd(param) {
        let status: any = 1;

        let body = new FormData();
        body.append('Code', param.Name);
        body.append('Description', param.Description);
        body.append('ValidFrom', this.dateConvertSet(param.ValidFrom));
        body.append('ValidTo', this.dateConvertSet(param.ValidTo));
        body.append('DiscountType', param.DiscoutType);
        body.append('DiscountValue', param.DiscountValue);
        body.append('MaxDeductionAmount', param.MaximumDeduction);
        body.append('MinAmountToAvailDiscount', param.MaximumPurchase);

        return this.http.post(this.helper.ApiBaseUrl + 'settings/coupon/add', body, this.helper.jwt())
            .map((response: Response) => response.json());
    }

    couponEdit(CouponId) {
        let options = this.helper.jwt();
        return this.http.get(this.helper.ApiBaseUrl + 'settings/coupon/edit/' + CouponId, options).map((response: Response) => response.json());
    }

    couponUpdate(param, RecordID) {
        let status: any = 1;
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + currentUser.access_token)

        let params = { 'Code': param.Name, 'Description': param.Description, 'ValidFrom': this.dateConvertSet(param.ValidFrom), 'ValidTo': this.dateConvertSet(param.ValidTo), 'DiscountType': param.DiscoutType, 'DiscountValue': param.DiscountValue, 'MaxDeductionAmount':param.MaximumDeduction, 'MinAmountToAvailDiscount':param.MaximumPurchase }
        
        return this.http.put(this.helper.ApiBaseUrl + 'settings/coupon/update/' + RecordID, JSON.stringify(params), { headers: headers })
            .map((response: Response) => response.json());
    }

    couponDelete(CouponId) {
        return this.http.delete(this.helper.ApiBaseUrl + 'settings/coupon/delete/' + CouponId, this.helper.jwt()).map((response: Response) => response.json());

    }


    


}
