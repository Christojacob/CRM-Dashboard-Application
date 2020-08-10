import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Helpers } from "../../../../../helpers";

@Injectable()
export class LanguageService {

    constructor(private http: Http, private helper: Helpers) { }

    LanguageList() {
        return this.http.get(this.helper.ApiBaseUrl + 'settings/language/fetch', this.helper.jwt()).map((response: Response) => response.json());
    }

    LanguageAdd(param) {

        let body = new FormData();
        body.append('Language', param.Language);
        body.append('Code', param.Code);

        return this.http.post(this.helper.ApiBaseUrl + 'settings/language/add', body, this.helper.jwt())
            .map((response: Response) => response.json());
    }

    LanguageEdit(Id) {
        return this.http.get(this.helper.ApiBaseUrl + 'settings/language/edit/' + Id, this.helper.jwt()).map((response: Response) => response.json());
    }

    LanguageUpdate(param, RecordID) {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + currentUser.access_token)

        let params = { 'token': currentUser.token, 'Language': param.Language, 'Code': param.Code }

        return this.http.put(this.helper.ApiBaseUrl + 'settings/language/update/' + RecordID, JSON.stringify(params), { headers: headers })
            .map((response: Response) => response.json());
    }

    LanguageDelete(Id) {

        return this.http.delete(this.helper.ApiBaseUrl + 'settings/language/delete/' + Id, this.helper.jwt()).map((response: Response) => response.json());

    }

}
