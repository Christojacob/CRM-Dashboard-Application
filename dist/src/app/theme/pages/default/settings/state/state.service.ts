import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Helpers } from "../../../../../helpers";

@Injectable()
export class StateService {

    constructor(private http: Http, private helper: Helpers) { }

    stateList(param) {
        let options = this.helper.jwt();
        options.params = param;
        return this.http.get(this.helper.ApiBaseUrl + 'settings/states', options).map((response: Response) => response.json());
    }

    allState(countryId) {

        if (countryId != null || countryId != 0) {
            return this.http.get(this.helper.ApiBaseUrl + 'settings/states/fetch/' + countryId, this.helper.jwt()).map((response: Response) => response.json());
        } else {
            return this.http.get(this.helper.ApiBaseUrl + 'settings/states/fetch', this.helper.jwt()).map((response: Response) => response.json());
        }
    }

    stateAdd(param) {
        let status: any = 1;

        let body = new FormData();
        body.append('Name', param.Name);
        body.append('StateCode', param.StateCode)
        body.append('Status', status)
        body.append('CountryId', param.CountryId)


        return this.http.post(this.helper.ApiBaseUrl + 'settings/states/add', body, this.helper.jwt())
            .map((response: Response) => response.json());
    }

    stateEdit(StateId) {
        return this.http.get(this.helper.ApiBaseUrl + 'settings/states/edit/' + StateId, this.helper.jwt()).map((response: Response) => response.json());
    }

    stateUpdate(param, RecordID) {
        let status: any = 1;
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + currentUser.access_token)


        let params = { 'Name': param.Name, 'StateCode': param.StateCode, 'Status': status, CountryId: null }
        if (param.CountryId != 0) {
            params.CountryId = param.CountryId
        }
        return this.http.put(this.helper.ApiBaseUrl + 'settings/states/edit/' + RecordID, JSON.stringify(params), { headers: headers })
            .map((response: Response) => response.json());
    }

    StateDelete(StateId) {

        // return new Promise(resolve=>{
        //   this.http.delete(this.helper.ApiBaseUrl+'settings/states/delete/'+StateId,this.helper.jwt());
        // });

        return this.http.delete(this.helper.ApiBaseUrl + 'settings/states/delete/' + StateId, this.helper.jwt()).map((response: Response) => response.json());

    }

}
