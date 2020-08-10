import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { Router } from '@angular/router';
import { DonationsService } from '../donations.service';

declare let $: any;

@Component({
    selector: 'app-cause-lists',
    templateUrl: './cause-lists.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class CauseListsComponent implements OnInit, AfterViewInit {
    causeDetails: any = {
        Title: "",
        Description: "",
        SubApplications: [],
        RestrictedCountries: [],
        PaymentOptions: [],
        PaymentAccountType: 0,
        ID: "",
        AnyAmount: 0,
        Status: 0
    };
    constructor(
        private helper: Helpers,
        private router: Router,
        private _donations: DonationsService
    ) { }

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
                            url: apiUrl + 'donation/cause/list',
                            headers: { 'Authorization': 'Bearer ' + user.access_token }
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
                        width: 150,
                        selector: false,
                        textAlign: 'center',
                    }, {
                        field: 'Title',
                        title: 'Title',
                        sortable: 'asc', // default sort
                        filterable: false, // disable or enable filtering
                        width: 150,
                    }, {
                        field: 'Description',
                        title: 'Description',
                        width: 250
                    }, {
                        field: 'View',
                        width: 110,
                        title: 'View Details',
                        sortable: false,
                        overflow: 'visible',
                        template: function(row, index, datatable) {
                            return '\
                              <a id="view-button-'+ row.RecordID + '" class="m-portlet__nav-link btn m-btn view-button" data="' + row.RecordID + '" title="View details">\
                                  View details\
                              </a>\
                          ';
                        },
                    }, {
                        field: 'Status',
                        title: 'Status',
                        // callback function support for column rendering
                        template: function(row) {
                            var status = {
                                1: { 'title': 'Active', 'class': ' m-badge--success' },
                                2: { 'title': 'Deactive', 'class': ' m-badge--warning' },
                            };
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

                $('.edit-button').on('click', function() {
                    let id = $(this).attr('data');
                    mm.editClick(id);
                })

                $('.delete-button').on('click', function() {
                    let id = $(this).attr('data');
                    let del = mm.deleteClick(id);
                })

                $('.view-button').on('click', function() {
                    let id = $(this).attr('data');
                    mm.viewDetails(id);
                })

            });

            datatable.sort('RecordID', 'asc')

        })
    }

    editClick(id) {
        this.router.navigateByUrl('/donations/cause-management/edit/' + id);
    }

    viewDetails(id) {
        $('#m_modal_5').modal('show');
        Helpers.setLoading(true);
        this._donations.CauseView(id).subscribe(data => {
            Helpers.setLoading(false);
            this.causeDetails = data.data.CauseDetail;
        }, error => {
            Helpers.setLoading(false);
        })
    }

    deleteClick(id) {
        let confirmed = false;
        if (confirm("Are you sure?")) {

            Helpers.setLoading(true);
            this._donations.CauseDelete(id).subscribe(
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

}
