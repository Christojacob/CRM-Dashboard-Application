import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Helpers } from "../../../../helpers";

@Injectable()
export class MemberService {

    constructor(private http: Http, private helper: Helpers) { }


    memberCreate(param) {

        let body = new FormData();
        body.append('IsCreateAccount', param.IsCreateAccount)
        body.append('SalutationId', param.SalutationId)
        body.append('FirstName', param.FirstName)
        body.append('LastName', param.LastName)
        body.append('CountryId', param.CountryId)
        body.append('MobileNumber', param.MobileNumber)
        body.append('SecondaryNumber', param.SecondaryNumber)
        body.append('Gender', param.Gender)
        body.append('PreferedLanguageOfCommunication', param.PreferedLanguageOfCommunication)
        body.append('PreferedModeOfContact', param.PreferedModeOfContact)
        body.append('CallOptoutFlag', param.CallOptoutFlag)
        body.append('EmailOptutFlag', param.EmailOptutFlag)
        body.append('Dob', param.Dob)
        body.append('Status', param.Status)
        body.append('Photo', param.Photo)
        body.append('Email', param.Email);
        body.append('UserName', param.UserName)

        return this.http.post(this.helper.ApiBaseUrl + 'backend/member-user/add', body, this.helper.jwt())
            .map((response: Response) => response.json());
    }

    memberPhoto(RecordID) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let photoUrl = this.helper.ApiBaseUrl + "backend/member-user/photo/" + RecordID + "?access_token=" + currentUser.access_token;
        return photoUrl;
    }

    memberEdit(Id) {

        return this.http.get(this.helper.ApiBaseUrl + 'backend/member-user/edit/' + Id, this.helper.jwt()).map((response: Response) => response.json());

    }

    memberUpdate(param, RecordID) {
        let status: any = 1;

        let body = new FormData();
        body.append('SalutationId', param.SalutationId)
        body.append('FirstName', param.FirstName)
        body.append('LastName', param.LastName)
        body.append('Photo', param.Photo)
        body.append('MobileNumber', param.MobileNumber)
        body.append('SecondaryNumber', param.SecondaryNumber)
        body.append('Gender', param.Gender)
        body.append('PreferedLanguageOfCommunication', param.PreferedLanguageOfCommunication)
        body.append('PreferedModeOfContact', param.PreferedModeOfContact)
        body.append('EmailOptutFlag', param.EmailOptutFlag)
        body.append('CallOptoutFlag', param.CallOptoutFlag)
        body.append('Status', param.Status)
        body.append('PhotoRemovedFlag', param.PhotoRemovedFlag)


        return this.http.post(this.helper.ApiBaseUrl + 'backend/member-user/update/' + RecordID, body, this.helper.jwt())
            .map((response: Response) => response.json());
    }

    memberDelete(RecodeId) {
        return this.http.delete(this.helper.ApiBaseUrl + 'settings/countries/delete/' + RecodeId, this.helper.jwt()).map((response: Response) => response.json());
    }

    memberView(Id) {
        return this.http.get(this.helper.ApiBaseUrl + 'backend/member-user/view/' + Id, this.helper.jwt()).map((response: Response) => response.json());
    }

    memberStatus(Status, RecordId) {

        let body = new FormData();
        body.append('Status', Status)

        return this.http.post(this.helper.ApiBaseUrl + 'backend/member-user/change-status/' + RecordId, body, this.helper.jwt())
            .map((response: Response) => response.json());
    }

    memberChangeAccount(param, RecordId) {

        let body = new FormData();
        body.append('NewEmail', param.NewEmail)
        body.append('NewUserName', param.NewUserName)

        return this.http.post(this.helper.ApiBaseUrl + 'backend/member-user/change-account/' + RecordId, body, this.helper.jwt())
            .map((response: Response) => response.json());
    }

    memberAddressList(Id) {
        return this.http.get(this.helper.ApiBaseUrl + 'backend/member-user/address/' + Id, this.helper.jwt()).map((response: Response) => response.json());
    }

    memberAddressCreate(param, Id) {

        let body = new FormData();
        body.append('AddressType', param.AddressType)
        body.append('Address1', param.Address1)
        body.append('Address2', param.Address2)
        body.append('City', param.City)
        body.append('CountryId', param.CountryId)
        body.append('StateId', param.StateId)
        body.append('Zip', param.Zip)

        return this.http.post(this.helper.ApiBaseUrl + 'backend/member-user/address/' + Id + '/add', body, this.helper.jwt())
            .map((response: Response) => response.json());
    }

    memberAddressEdit(AddressId) {
        return this.http.get(this.helper.ApiBaseUrl + 'backend/member-user/address/edit/' + AddressId, this.helper.jwt()).map((response: Response) => response.json());
    }

    memberAddressUpdate(param, AddressId) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + currentUser.access_token)


        let params = { 'AddressType': param.AddressType, 'Address1': param.Address1, 'Address2': param.Address2, 'City': param.City, 'CountryId': param.CountryId, 'StateId': param.StateId, 'Zip': param.Zip, 'Status': param.Status }

        return this.http.put(this.helper.ApiBaseUrl + 'backend/member-user/address/update/' + AddressId, JSON.stringify(params), { headers: headers })
            .map((response: Response) => response.json());
    }

    memberAddressDelete(AddressId) {

        return this.http.delete(this.helper.ApiBaseUrl + 'backend/member-user/address/delete/' + AddressId, this.helper.jwt()).map((response: Response) => response.json());
    }

    memberAddressStatusChange(Status, AddressId) {

        let body = new FormData();
        body.append('Status', Status)

        return this.http.post(this.helper.ApiBaseUrl + 'backend/member-user/address/change-status/' + AddressId, body, this.helper.jwt())
            .map((response: Response) => response.json());
    }

    familyMemberCreate(param, memberId) {

        let body = new FormData();
        body.append('SalutationId', param.SalutationId)
        body.append('RelationshipId', param.RelationshipId)
        body.append('FirstName', param.FirstName)
        body.append('LastName', param.LastName)
        body.append('MobileNumber', param.MobileNumber)
        body.append('SecondaryNumber', param.SecondaryNumber)
        body.append('Gender', param.Gender)
        body.append('Dob', param.Dob)
        body.append('Photo', param.Photo)
        body.append('Email', param.Email);

        return this.http.post(this.helper.ApiBaseUrl + `backend/member-user/family-member/${memberId}/add`, body, this.helper.jwt())
            .map((response: Response) => response.json());
    }

    addressMemberCreate(param, memberId) {

        let body = new FormData();
        body.append('AddressType', param.AddressType)
        body.append('Address1', param.Address1)
        body.append('Address2', param.Address2)
        body.append('City', param.City)
        body.append('CountryId', param.CountryId)
        body.append('StateId', param.StateId)
        body.append('Zip', param.Zip)

        return this.http.post(this.helper.ApiBaseUrl + `backend/member-user/address/${memberId}/add`, body, this.helper.jwt())
            .map((response: Response) => response.json());
    }


}
