import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Helpers } from "../../../../helpers";

declare let $: any;

@Injectable()
export class DonationsService {

    constructor(private http: Http, private helper: Helpers) { }

    causeCreate(param) {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + currentUser.access_token)

        return this.http.post(this.helper.ApiBaseUrl + 'donation/cause/add', param, { headers: headers })
            .map((response: Response) => response.json());
    }

    CauseView(RecordId) {
        return this.http.get(this.helper.ApiBaseUrl + 'donation/cause/view/' + RecordId, this.helper.jwt()).map((response: Response) => response.json());
    }

    CauseEdit(RecordId) {
        return this.http.get(this.helper.ApiBaseUrl + 'donation/cause/edit/' + RecordId, this.helper.jwt()).map((response: Response) => response.json());
    }

    CauseUpdate(param, RecordId) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + currentUser.access_token)

        return this.http.put(this.helper.ApiBaseUrl + 'donation/cause/update/' + RecordId, param, { headers: headers })
            .map((response: Response) => response.json());
    }

    CauseDelete(Id) {

        return this.http.delete(this.helper.ApiBaseUrl + 'donation/cause/delete/' + Id, this.helper.jwt()).map((response: Response) => response.json());

    }

    formatRepo(repo) {
        let mm = this;
        if (repo.loading) return repo.text;

        var markup = `<div class="m-card-user m-card-user--sm">
                    <div class="m-card-user__pic">
                      <img src="${mm.helper.ApiBaseUrl}backend/member-user/photo/${repo.id}" class="m--img-rounded m--marginless" alt="photo">
                    </div>
                    <div class="m-card-user__details"><span class="m-card-user__name"> ${repo.FirstName} ${repo.LastName} </span>
                      <a href="" class="m-card-user__email m-link">tester</a>
                    </div>
                  </div>`;

        return markup;
    }

    formatRepoSelection(repo) {
        console.log('test');
        return repo.FirstName || repo.text;
    }

    CauseProcessSelect2() {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let mm = this;

        $("#choose_member").select2({
            placeholder: "Search for member list",
            allowClear: true,
            ajax: {
                url: mm.helper.ApiBaseUrl + "backend/member-user/search",
                dataType: 'json',
                delay: 250,
                headers: { 'Authorization': 'Bearer ' + currentUser.access_token },
                data: function(params) {
                    return {
                        Term: params.term,
                    };
                },
                processResults: function(data, params) {
                    return {
                        results: data.data.MemberList,
                    };
                },
                cache: true
            },
            escapeMarkup: function(markup) {
                return markup;
            },
            minimumInputLength: 1,
            templateResult: mm.formatRepo.bind(this),
            templateSelection: mm.formatRepoSelection.bind(this)
        });
    }

    getBrainTreeToken(CountryPaymentSettingId) {

        return this.http.get(`${this.helper.ApiBaseUrl}donation/process/payment/client-token/${CountryPaymentSettingId}`, this.helper.jwt());
    }

}
