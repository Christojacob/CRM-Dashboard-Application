import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Helpers } from "../../../../../helpers";

@Injectable()
export class FamilyRelationshipService {

    constructor(private http: Http, private helper: Helpers) { }

    FamilyAdd(param) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let body = new FormData();
        body.append('RelationshipName', param.RelationshipName);

        return this.http.post(this.helper.ApiBaseUrl + 'settings/family-relationship/add', body, this.helper.jwt())
            .map((response: Response) => response.json());
    }

    familyEdit(FamilyId) {
        let options = this.helper.jwt();
        return this.http.get(this.helper.ApiBaseUrl + 'settings/family-relationship/edit/' + FamilyId, options).map((response: Response) => response.json());
    }

    familyUpdate(param, RecordID) {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + currentUser.access_token)


        let params = { 'RelationshipName': param.RelationshipName }

        return this.http.put(this.helper.ApiBaseUrl + 'settings/family-relationship/update/' + RecordID, JSON.stringify(params), { headers: headers })
            .map((response: Response) => response.json());
    }

    FamilyDelete(FamilyId) {

        return this.http.delete(this.helper.ApiBaseUrl + 'settings/family-relationship/delete/' + FamilyId, this.helper.jwt()).map((response: Response) => response.json());

    }

}
