import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { Router } from "@angular/router";

import { MemberService } from '../member.service';

declare let $: any;

@Component({
    selector: 'app-member-lists',
    templateUrl: './member-lists.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class MemberListsComponent implements OnInit, AfterViewInit {

    constructor(private helper: Helpers, private router: Router, private _memberService: MemberService) {

    }

    ngOnInit() {
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
                            url: apiUrl + 'backend/member-user',
                            headers: { 'Authorization': 'Bearer ' + user.access_token },
                            map: function(raw) {
                                // sample data mapping
                                var dataSet = raw;
                                if (typeof raw.data !== 'undefined') {
                                    dataSet = raw.data;
                                }
                                else {
                                    dataSet = null;
                                }
                                return dataSet;
                            },
                        }
                    },
                    pageSize: 10,
                    serverPaging: true,
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

                pagination: true,

                toolbar: {
                    // toolbar items
                    items: {
                        // pagination
                        pagination: {
                            // page size select
                            pageSizeSelect: [10, 20, 30, 50, 100],
                        },
                    },
                },

                search: {
                    input: $('#generalSearch'),
                },

                // columns definition
                columns: [
                    {
                        field: 'RecordID',
                        title: '#',
                        sortable: true, // disable sort for this column
                        width: 40,
                        selector: { class: 'm-checkbox--solid m-checkbox--brand' },
                        textAlign: 'center',
                    }, {
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
                        <span class="m-card-user__name">\
                        <a data="'+ data.RecordID + '" class="view-link">' + data.FirstName + '</a>\
                        </span>\
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
                        field: 'UserName',
                        title: 'User Name',
                        width: 150,
                    }, {
                        field: 'Status',
                        title: 'Status',
                        // callback function support for column rendering
                        template: function(row) {
                            var status = {
                                1: { 'title': 'Active', 'class': ' m-badge--success' },
                                2: { 'title': 'Deactive', 'class': ' m-badge--warning' },
                            };
                            row.Status = row.Status == null ? 2 : row.Status;
                            return '<span class="m-badge ' + status[row.Status].class + ' m-badge--wide">' + status[row.Status].title + '</span>';
                        },
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

                $('.edit-button').on('click', function() {
                    let id = $(this).attr('data');
                    mm.editClick(id);
                })

                $('.view-link').on('click', function() {
                    let id = $(this).attr('data');
                    mm.viewClick(id);
                })

                $('.delete-button').on('click', function() {
                    let id = $(this).attr('data');
                    let del = mm.deleteClick(id);
                    if (del) {
                        deleted()
                    }
                })

            });

            datatable.sort('RecordID', 'asc')

            function deleted() {
                datatable.reload()
            }
        })

    }

    editClick(id) {
        this.router.navigateByUrl('/member/edit/' + id);
    }

    deleteClick(id) {
        let confirmed = false;
        if (confirm("Are you sure?")) {

            Helpers.setLoading(true);
            this._memberService.memberDelete(id).subscribe(
                data => {
                    console.log(data)
                    Helpers.setLoading(false);
                    if (data.status == "success") {
                        Helpers.DisplayMsg(data)
                        this.router.routeReuseStrategy.shouldReuseRoute = function() { return false; };
                        let currentUrl = this.router.url + '?';
                        this.router.navigateByUrl(currentUrl)
                            .then(() => {
                                this.router.navigated = false;
                                this.router.navigate([this.router.url]);
                            });
                    } else {
                        Helpers.DisplayMsg(data)
                    }
                },
                error => {
                    Helpers.setLoading(false);
                    Helpers.DisplayMsg({ status: 'error', msg: 'Something when wrong.Please try later' })
                });
        }
    }

    viewClick(id) {
        this.router.navigateByUrl('/members/' + id);
    }



}
