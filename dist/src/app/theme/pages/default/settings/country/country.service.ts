import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Helpers } from "../../../../../helpers";

@Injectable()
export class CountryService {

    constructor(private http: Http, private helper: Helpers) { }

    countryList(param) {
        let options = this.helper.jwt();
        options.params = param;
        return this.http.get(this.helper.ApiBaseUrl + 'settings/countries', options).map((response: Response) => response.json());
    }

    allCountry(param) {
        let options = this.helper.jwt();
        options.params = param;
        return this.http.get(this.helper.ApiBaseUrl + 'settings/countries/list', options).map((response: Response) => response.json());
    }


    primaryCountryPossibility() {
        return this.http.get(this.helper.ApiBaseUrl + 'settings/primary-country/fetch-primary-country-possible-countries', this.helper.jwt()).map((response: Response) => response.json());
    }

    linkedCountryPossibility(param) {
        if (param == "") {
            return this.http.get(this.helper.ApiBaseUrl + 'settings/primary-country/fetch-possible-linked-countries', this.helper.jwt()).map((response: Response) => response.json());
        } else {
            return this.http.get(this.helper.ApiBaseUrl + 'settings/primary-country/fetch-possible-linked-countries/' + param, this.helper.jwt()).map((response: Response) => response.json());
        }
    }

    countryAdd(param) {
        let status: any = 1;

        let body = new FormData();
        body.append('Name', param.Name);
        body.append('SortName', param.SortName)
        body.append('Currency', param.Currency)
        body.append('CurrencySymbol', param.CurrencySymbol)
        body.append('PhoneCode', param.PhoneCode)
        body.append('Status', status)
        if (param.PrimaryCountryId != 0) {
            body.append('PrimaryCountryId', param.PrimaryCountryId)
        }

        return this.http.post(this.helper.ApiBaseUrl + 'settings/countries/add', body, this.helper.jwt())
            .map((response: Response) => response.json());
    }

    countryEdit(CountryId) {
        let options = this.helper.jwt();
        return this.http.get(this.helper.ApiBaseUrl + 'settings/countries/edit/' + CountryId, options).map((response: Response) => response.json());
    }

    countryUpdate(param, RecordID) {
        let status: any = 1;
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + currentUser.access_token)

        let params = { 'Name': param.Name, 'SortName': param.SortName, 'Currency': param.Currency, 'CurrencySymbol': param.CurrencySymbol, 'PhoneCode': param.PhoneCode, 'Status': status, PrimaryCountryId: null }
        if (param.PrimaryCountryId != 0) {
            params.PrimaryCountryId = param.PrimaryCountryId
        }
        return this.http.put(this.helper.ApiBaseUrl + 'settings/countries/edit/' + RecordID, JSON.stringify(params), { headers: headers })
            .map((response: Response) => response.json());
    }

    CountryDelete(CountryId) {
        return this.http.delete(this.helper.ApiBaseUrl + 'settings/countries/delete/' + CountryId, this.helper.jwt()).map((response: Response) => response.json());

    }


    CurrencyList() {
        return this.http.get(this.helper.ApiBaseUrl + 'settings/currency', this.helper.jwt()).map((response: Response) => response.json());
    }

    PrimaryCountryAdd(param) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + currentUser.access_token)

        return this.http.post(this.helper.ApiBaseUrl + 'settings/primary-country/add', JSON.stringify(param), { headers: headers })
            .map((response: Response) => response.json());
    }

    PrimaryCountryEdit(countryId) {
        return this.http.get(this.helper.ApiBaseUrl + 'settings/primary-country/edit/' + countryId, this.helper.jwt()).map((response: Response) => response.json());
    }

    PrimaryCountryUpdate(param, RecordID) {
        let status: any = 1;
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + currentUser.access_token)

        return this.http.put(this.helper.ApiBaseUrl + 'settings/primary-country/edit/' + RecordID, JSON.stringify(param), { headers: headers })
            .map((response: Response) => response.json());
    }


}
