import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Helpers } from "../helpers";
import { Router } from "@angular/router";

@Injectable()
export class CommonCrudService {

    constructor(private http: Http, private helper: Helpers, private router: Router) { }

    getData(data) {
        Helpers.setLoading(true);
        let options = this.helper.jwt();
        if (data.params) {
            options.params = data.params;
        }

        return this.http.get(this.helper.ApiBaseUrl + data.url, options).map((response: Response) => {
            Helpers.setLoading(false);
            const res = response.json();
            if (res.status == "success") {
                return res.data;
            } else {
                Helpers.DisplayMsg(res)
            }
        });
    }

    postData(data) {
        Helpers.setLoading(true);
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + currentUser.access_token)

        return this.http.post(this.helper.ApiBaseUrl + data.url, data.params, { headers: headers })
            .map((response: Response) => {
                Helpers.setLoading(false);
                const res = response.json();
                if (res.status == "success") {
                    // return res.data;
                    Helpers.DisplayMsg(res)
                } else {
                    Helpers.DisplayMsg(res)
                }
            });
    }

    putData(data) {
        Helpers.setLoading(true);
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + currentUser.access_token)

        return this.http.put(this.helper.ApiBaseUrl + data.url, JSON.stringify(data.params), { headers: headers })
            .map((response: Response) => {
                Helpers.setLoading(false);
                const res = response.json();
                if (res.status == "success") {
                    // return res.data;
                    Helpers.DisplayMsg(res)
                } else {
                    Helpers.DisplayMsg(res)
                }
            });
    }

    deleteData(data) {

        if (confirm("Are you sure?")) {

            Helpers.setLoading(true);
            return this.http.delete(this.helper.ApiBaseUrl + data.url, this.helper.jwt())
                .map((response: Response) => {
                    Helpers.setLoading(false);
                    return response.json();
                });


        }



    }

}
