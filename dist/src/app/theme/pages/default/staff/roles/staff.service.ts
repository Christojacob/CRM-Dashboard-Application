import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Helpers } from "../../../../../helpers";

@Injectable()
export class StaffService {

  constructor(private http: Http, private helper: Helpers) { }

  staffCreate(param) {

      let body = new FormData();
      body.append('IsCreateAccount', param.IsCreateAccount)
      body.append('SalutationId', param.SalutationId)
      body.append('FirstName', param.FirstName)
      body.append('LastName', param.LastName)
      body.append('CountryId', param.CountryId)
      body.append('MobileNumber', param.MobileNumber)
      body.append('SecondaryNumber', param.SecondaryNumber)
      body.append('Gender', param.Gender)
      body.append('Dob', param.Dob)
      body.append('Photo', param.Photo)
      body.append('Email', param.Email)
      body.append('UserName', param.UserName)

      return this.http.post(this.helper.ApiBaseUrl + 'staff/add', body, this.helper.jwt())
          .map((response: Response) => response.json());
  }

  StaffDelete(Id) {

      // return new Promise(resolve=>{
      //   this.http.delete(this.helper.ApiBaseUrl+'settings/states/delete/'+StateId,this.helper.jwt());
      // });

      return this.http.delete(this.helper.ApiBaseUrl + 'staff/trash/' + Id, this.helper.jwt()).map((response: Response) => response.json());

  }

  staffEdit(Id) {

      return this.http.get(this.helper.ApiBaseUrl + 'staff/edit/' + Id, this.helper.jwt()).map((response: Response) => response.json());

  }

  staffUpdate(param, RecordID) {
    let status: any = 1;

    let body = new FormData();
    body.append('SalutationId', param.SalutationId)
    body.append('SalutationId', param.SalutationId)
    body.append('FirstName', param.FirstName)
    body.append('LastName', param.LastName)
    body.append('CountryId', param.CountryId)
    body.append('MobileNumber', param.MobileNumber)
    body.append('SecondaryNumber', param.SecondaryNumber)
    body.append('Gender', param.Gender)
    body.append('Dob', param.Dob)
    body.append('Photo', param.Photo)
    body.append('Email', param.Email)
    body.append('UserName', param.UserName)
    body.append('Status', param.Status)


    return this.http.post(this.helper.ApiBaseUrl + 'staff/update/' + RecordID, body, this.helper.jwt())
        .map((response: Response) => response.json());
}

}
