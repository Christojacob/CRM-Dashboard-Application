import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Helpers } from "../../../../../helpers";

@Injectable()
export class SalutationService {

    constructor(private http: Http, private helper: Helpers) { }

    SalutationList() {
        return this.http.get(this.helper.ApiBaseUrl + 'settings/salutation/fetch', this.helper.jwt()).map((response: Response) => response.json());
    }

    SalutationAdd(param) {

        let body = new FormData();
        body.append('Salutation', param.Salutation);

        return this.http.post(this.helper.ApiBaseUrl + 'settings/salutation/add', body, this.helper.jwt())
            .map((response: Response) => response.json());
    }

    SalutationEdit(SalutationId) {
        return this.http.get(this.helper.ApiBaseUrl + 'settings/salutation/edit/' + SalutationId, this.helper.jwt()).map((response: Response) => response.json());
    }

    SalutationUpdate(param, RecordID) {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + currentUser.access_token)

        let params = { 'Salutation': param.Salutation }

        return this.http.put(this.helper.ApiBaseUrl + 'settings/salutation/update/' + RecordID, JSON.stringify(params), { headers: headers })
            .map((response: Response) => response.json());
    }

    SalutationDelete(Id) {

        return this.http.delete(this.helper.ApiBaseUrl + 'settings/salutation/delete/' + Id, this.helper.jwt()).map((response: Response) => response.json());

    }

}
