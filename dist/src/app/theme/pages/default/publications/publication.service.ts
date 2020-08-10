import { Injectable, OnInit } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from "@angular/http";
import { Helpers } from "../../../../helpers";

declare let $: any;

@Injectable()
export class PublicationService implements OnInit{
  categoryList : any;

  constructor(public http: Http, private helper: Helpers) { }

  getCategories(){
    let options = this.helper.jwt();
      return this.http.get(this.helper.ApiBaseUrl+'publication/categories', options).map((response: Response) => response.json())
  }
  getFrequency(){
    let options = this.helper.jwt();
      return this.http.get(this.helper.ApiBaseUrl+'publication/frequency', options).map((response: Response) => response.json())
  }
  ngOnInit(){

  }
  publicationCreate(param, LocalAdminList, availableCountries ){
        console.log(availableCountries);
        let localAdmins = JSON.stringify(param.LocalAdmins);
        let body = new FormData();
        body.append('PublicationCategoryId', param.PublicationCategoryId)
        body.append('Description', param.Description)
        body.append('LanguageId', param.Language)
        body.append('EditionCountryId', param.EditionCountryId)
        body.append('PublicationFrequencyId', param.PublicationFrequencyId)
        body.append('Logo', param.Logo)
        body.append('AvailableCountries', availableCountries)
        body.append('EditionAdmins', param.EditionAdmins)
        body.append('LocalAdmins', LocalAdminList)
        body.append('AvailableApplications', param.SubApplications)

        return this.http.post(this.helper.ApiBaseUrl + 'publication/add', body, this.helper.jwt())
            .map((response: Response) => response.json());
  }

  publicationUpdate(param, LocalAdminList, availableCountries, Id ){
    console.log(availableCountries);
    let localAdmins = JSON.stringify(param.LocalAdmins);
    let body = new FormData();
    body.append('PublicationCategoryId', param.PublicationCategoryId)
    body.append('Description', param.Description)
    body.append('LanguageId', param.Language)
    body.append('EditionCountryId', param.EditionCountryId)
    body.append('PublicationFrequencyId', param.PublicationFrequencyId)
    body.append('Logo', param.Logo)
    body.append('AvailableCountries', availableCountries)
    body.append('EditionAdmins', param.EditionAdmins)
    body.append('LocalAdmins', LocalAdminList)
    body.append('AvailableApplications', param.SubApplications)
    body.append('LogoRemovedFlag', param.LogoRemovedFlag)

    return this.http.post(this.helper.ApiBaseUrl + 'publication/update/'+ Id, body, this.helper.jwt())
        .map((response: Response) => response.json());
}

  PublicationEdit(Id){
        return this.http.get(this.helper.ApiBaseUrl + 'publication/edit/' + Id, this.helper.jwt()).map((response: Response) => response.json());
  }

  AdminSelect2() {

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let mm = this;

    $(".localadminform:last .m_select_local_admin").select2({
        placeholder: "Search for admin list",
        allowClear: true,
        ajax: {
            url: mm.helper.ApiBaseUrl + "staff/search",
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
                    results: data.data,
                };
            },
            
        },
        escapeMarkup: function(markup) {
            return markup;
        },
        minimumInputLength: 1,
        templateResult: mm.formatRepo.bind(this),
        templateSelection: mm.formatRepoSelection1.bind(this)
    });
}

PublicationDelete(Id) {

    // return new Promise(resolve=>{
    //   this.http.delete(this.helper.ApiBaseUrl+'settings/states/delete/'+StateId,this.helper.jwt());
    // });

    return this.http.delete(this.helper.ApiBaseUrl + 'publication/delete/' + Id, this.helper.jwt()).map((response: Response) => response.json());

}

AdminSelect2load() {

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let mm = this;

    $(" .m_select_local_admin").select2({
        placeholder: "Search for admin list",
        allowClear: true,
        ajax: {
            url: mm.helper.ApiBaseUrl + "staff/search",
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
                    results: data.data,
                };
            },
            
        },
        escapeMarkup: function(markup) {
            return markup;
        },
        minimumInputLength: 1,
        templateResult: mm.formatRepo.bind(this),
        templateSelection: mm.formatRepoSelection1.bind(this)
    });
}

EditionAdminSelect2() {

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let mm = this;

    $(".m_select_edition_admin").select2({
        placeholder: "Search for admin list",
        allowClear: true,
        ajax: {
            url: mm.helper.ApiBaseUrl + "staff/search",
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
                    results: data.data,
                };
            },
            
        },
        escapeMarkup: function(markup) {
            return markup;
        },
        minimumInputLength: 1,
        templateResult: mm.formatRepo.bind(this),
        templateSelection: mm.formatRepoSelection1.bind(this)
    });
}



formatRepo(repo) {
  let mm = this;
  if (repo.loading) return repo.text;

  var markup = `<div class="m-card-user m-card-user--sm">
              <div class="m-card-user__pic">
                <img src="${mm.helper.ApiBaseUrl}backend/staff/photo/${repo.Id}" class="m--img-rounded m--marginless" alt="photo">
              </div>
              <div class="m-card-user__details"><span class="m-card-user__name"> ${repo.FirstName} ${repo.LastName} </span>
                <a href="" class="m-card-user__email m-link">tester</a>
              </div>
            </div>`;

  return markup;
}

formatRepoSelection1(repo) {
  return repo.FirstName || repo.text;
}


getPublication(param) {
    let options = this.helper.jwt();
    options.params = param;
    return this.http.get(this.helper.ApiBaseUrl + 'publication/fetch-all', options).map((response: Response) => response.json());
}

getAvailablePublicationCountry(param){
    let options = this.helper.jwt();
    options.params = param;
    return this.http.get(this.helper.ApiBaseUrl + 'publication/manage-price/fetch-related-data', options).map((response: Response) => response.json());
}
getCurrency(){
    let options = this.helper.jwt();
   // options.params = param;
    return this.http.get(this.helper.ApiBaseUrl + 'settings/currency', options).map((response: Response) => response.json());
}


publicationSingleAdd(param) {
    let status: any = 1;
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + currentUser.access_token)
    
    let body={'PriceTypeId': "1",'PublicationId': param.Publication,PriceGrid:param.PriceGrid};

    return this.http.post(this.helper.ApiBaseUrl + 'publication/manage-price/add', JSON.stringify(body),  { headers: headers })
        .map((response: Response) => response.json());
}
publicationSingleUpdate(param,Id) {
    let status: any = 1;
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + currentUser.access_token)
    
    let body={'PriceTypeId': "1",'PublicationId': param.Publication,PriceGrid:param.PriceGrid};

    return this.http.put(this.helper.ApiBaseUrl + 'publication/manage-price/update/'+Id, JSON.stringify(body),  { headers: headers })
        .map((response: Response) => response.json());
}

publicationBulkAdd(param) {
    let status: any = 1;
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + currentUser.access_token)
    
    let body={'PriceTypeId': "3",'PublicationId': param.Publication,PriceGrid:param.PriceGrid};

    return this.http.post(this.helper.ApiBaseUrl + 'publication/manage-price/add', JSON.stringify(body),  { headers: headers })
        .map((response: Response) => response.json());
}

publicationBulkUpdate(param,Id) {
    let status: any = 1;
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + currentUser.access_token)
    
    let body={'PriceTypeId': "3",'PublicationId': param.Publication,PriceGrid:param.PriceGrid};

    return this.http.put(this.helper.ApiBaseUrl + 'publication/manage-price/update/'+Id, JSON.stringify(body),  { headers: headers })
        .map((response: Response) => response.json());
}
publicationComboAdd(param,PublicationId) {
    let status: any = 1;
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + currentUser.access_token)
    
    let body={'PriceTypeId': "2",'PublicationId': PublicationId,PriceGrid:param.PriceGrid};

    return this.http.post(this.helper.ApiBaseUrl + 'publication/manage-price/add', JSON.stringify(body),  { headers: headers })
        .map((response: Response) => response.json());
}

publicationComboUpdate(param,PublicationId,Id) {
    let status: any = 1;
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + currentUser.access_token)
    
    let body={'PriceTypeId': "2",'PublicationId': PublicationId,PriceGrid:param.PriceGrid};

    return this.http.put(this.helper.ApiBaseUrl + 'publication/manage-price/update/'+Id, JSON.stringify(body),  { headers: headers })
        .map((response: Response) => response.json());
}

    PriceManagementList(){
        let options = this.helper.jwt();
        return this.http.get(this.helper.ApiBaseUrl+'publication/manage-price/list', options).map((response: Response) => response.json())
    }

    PublicationSingleEdit(singleEdit) {
        let options = this.helper.jwt();
        return this.http.get(this.helper.ApiBaseUrl + 'publication/manage-price/edit/' + singleEdit, options).map((response: Response) => response.json());
    }
    PriceManagementDelete(Id) {
        return this.http.delete(this.helper.ApiBaseUrl + 'publication/manage-price/trash/' + Id, this.helper.jwt()).map((response: Response) => response.json());

    }
    PriceManagementRestore(Id) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + currentUser.access_token)
        let body = {};
        return this.http.post(this.helper.ApiBaseUrl + 'publication/manage-price/restore/'+Id, JSON.stringify(body),  { headers: headers })
        .map((response: Response) => response.json());

    }




}