import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import "rxjs/add/operator/map";
import { Helpers } from "../../helpers";


@Injectable()
export class AuthenticationService {

    constructor(private http: Http, private helper: Helpers) {
    }

    login(email: string, password: string) {

        let body = new FormData();
        body.append('Email', email);
        body.append('Password', password);

        return this.http.post(this.helper.ApiBaseUrl + 'user/authenticate', body)
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let responseJs = response.json();
                let user = responseJs.data
                console.log(user)
                if (user && user.access_token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}