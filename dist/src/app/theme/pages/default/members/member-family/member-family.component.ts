import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ActivatedRoute } from '@angular/router';

declare let $: any;

@Component({
    selector: 'app-member-family',
    templateUrl: './member-family.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class MemberFamilyComponent implements OnInit, AfterViewInit {

    routeParams: any;

    constructor(
        private activeRoute: ActivatedRoute,
        private helper: Helpers
    ) { }

    ngOnInit() {
        this.routeParams = this.activeRoute.snapshot.params;
    }

    ngAfterViewInit() {
        let mm = this;
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let apiUrl = this.helper.ApiBaseUrl;
        $(document).ready(function() {

            let datatable = (<any>$('.m_datatables')).mDatatable({
                // datasource definition
                data: {
                    type: 'remote',
                    source: {
                        read: {
                            method: 'GET',
                            url: apiUrl + `backend/member-user/family-member/${mm.routeParams.MemberId}/list-family-members`,
                            headers: { 'Authorization': 'Bearer ' + user.access_token }
                        }
                    },
                    serverFiltering: true,
                    serverSorting: true,
                },

                order: [],

                // layout definition
                layout: {
                    theme: 'default',
                    class: '',
                    scroll: false,
                    footer: false
                },

                // column sorting
                sortable: true,

                pagination: false,

                search: {
                    input: $('#generalSearch'),
                },

                // columns definition
                columns: [
                    {
                        width: 200,
                        field: 'FirstName',
                        title: 'Name',
                        template: function(data) {
                            let imageUrl = apiUrl + "backend/member-user/photo/" + data.RecordID + "?token=" + user.access_token
                            var output = '<div class="m-card-user m-card-user--sm">\
                  <div class="m-card-user__pic">\
                    <img src="' + imageUrl + '" class="m--img-rounded m--marginless" alt="photo">\
                  </div>\
                  <div class="m-card-user__details">\
                    <span class="m-card-user__name">' + data.FirstName + '</span>\
                    <a href="" class="m-card-user__email m-link">' +
                                data.LastName + '</a>\
                  </div>\
                </div>';

                            return output;
                        },
                    }, {
                        field: 'Email',
                        title: 'Email Id',
                        width: 150,
                    }, {
                        field: 'Relationship',
                        title: 'Relationship',
                        width: 150,
                    }, {
                        field: 'Actions',
                        width: 110,
                        title: 'Actions',
                        sortable: false,
                        overflow: 'visible',
                        template: function(row, index, datatable) {
                            var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
                            return '\
                          <div class="dropdown ' + dropup + '">\
                              <a href="#" class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown">\
                                  <i class="la la-ellipsis-h"></i>\
                              </a>\
                                <div class="dropdown-menu dropdown-menu-right">\
                                  <a class="dropdown-item edit-button" data="'+ row.RecordID + '" ><i class="la la-edit"></i> Edit Details</a>\
                                  <a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>\
                                  <a class="dropdown-item" href="#"><i class="la la-print"></i> Generate Report</a>\
                                </div>\
                          </div>\
                          <a id="edit-button-'+ row.RecordID + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill edit-button" data="' + row.RecordID + '" title="Edit details">\
                              <i class="la la-edit"></i>\
                          </a>\
                          <a class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill delete-button" data="'+ row.RecordID + '" title="Delete">\
                              <i class="la la-trash"></i>\
                          </a>\
                      ';
                        },
                    }],

            });

            $('#m_form_status').on('change', function() {
                datatable.search($(this).val(), 'Status');
            });

            $('#m_form_type').on('change', function() {
                datatable.search($(this).val(), 'Type');
            });

            $('#m_form_status, #m_form_type').selectpicker();

            $(datatable).on('m-datatable--on-layout-updated', function() {

                // $('.edit-button').on('click', function () {
                //   let id = $(this).attr('data');
                //   mm.editClick(id);
                // })

                // $('.delete-button').on('click', function () {
                //   let id = $(this).attr('data');
                //   let del = mm.deleteClick(id);
                //   if (del) {
                //     deleted()
                //   }
                // })

            });

            datatable.sort('RecordID', 'asc')

            function deleted() {
                datatable.reload()
            }
        })

    }

}
