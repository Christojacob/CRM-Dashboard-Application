import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Helpers } from "../../../../../helpers";

@Injectable()
export class SubApplicationService {

    constructor(private http: Http, private helper: Helpers) { }

    SubApplicationList() {
        return this.http.get(this.helper.ApiBaseUrl + 'settings/sub-application/list', this.helper.jwt()).map((response: Response) => response.json());
    }

    SubApplicationAdd(param) {

        let body = new FormData();
        body.append('Name', param.Name);
        body.append('WebSiteUrl', param.WebSiteUrl);

        return this.http.post(this.helper.ApiBaseUrl + 'settings/sub-application/add', body, this.helper.jwt())
            .map((response: Response) => response.json());
    }

    SubApplicationEdit(SubApplicationId) {
        return this.http.get(this.helper.ApiBaseUrl + 'settings/sub-application/edit/' + SubApplicationId, this.helper.jwt()).map((response: Response) => response.json());
    }

    SubApplicationUpdate(param, RecordID) {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + currentUser.access_token)

        let params = { 'Name': param.Name, 'WebSiteUrl': param.WebSiteUrl }

        return this.http.put(this.helper.ApiBaseUrl + 'settings/sub-application/edit/' + RecordID, JSON.stringify(params), { headers: headers })
            .map((response: Response) => response.json());
    }

    SubApplicationDelete(Id) {

        return this.http.delete(this.helper.ApiBaseUrl + 'settings/sub-application/delete/' + Id, this.helper.jwt()).map((response: Response) => response.json());

    }

}
