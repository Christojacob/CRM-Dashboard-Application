import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { Router } from "@angular/router";

import { CountryService } from '../../country/country.service';

declare let $: any;

@Component({
    selector: 'app-payment-lists',
    templateUrl: './payment-lists.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class PaymentListsComponent implements OnInit, AfterViewInit {

    constructor(private helper: Helpers, private router: Router, private _countryService: CountryService) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        let mm = this;
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let apiUrl = this.helper.ApiBaseUrl;
        $(document).ready(function() {

            let datatable = (<any>$('.m_datatable')).mDatatable({
                // datasource definition
                data: {
                    type: 'remote',
                    source: {
                        read: {
                            method: 'GET',
                            url: apiUrl + 'settings/countries',
                            headers: { 'Authorization': 'Bearer ' + user.access_token }
                        }
                    },
                    pageSize: 10,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
                },

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
                        sortable: false, // disable sort for this column
                        width: 40,
                        selector: false,
                        textAlign: 'center',
                    }, {
                        field: 'CountryName',
                        title: 'Name',
                        // sortable: 'asc', // default sort
                        filterable: false, // disable or enable filtering
                        width: 150,
                        // basic templating support for column rendering,
                        template: '{{CountryName}}',
                    }, {
                        field: 'SortName',
                        title: 'Country Code',
                        width: 150,
                    }, {
                        field: 'Currency',
                        title: 'Currency',
                        width: 100
                    }, {
                        field: 'CurrencySymbol',
                        title: 'Currency Symbol',
                        width: 150,
                        template: function(row) {
                            return '<i class="fa ' + row.CurrencySymbol + '"></i>';
                        }
                    }, {
                        field: 'PhoneCode',
                        title: 'Phone Code',
                        width: 100
                    }, {
                        field: 'PrimaryCountry',
                        title: 'Primary Country',
                        width: 100
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
                    if (del) {
                        console.log("testststst")
                        deleted()
                    }
                })

            });

            function deleted() {
                console.log('reloaded')
                datatable.reload()
            }
        })

    }

    editClick(id) {
        this.router.navigateByUrl('/setting/country/edit/' + id);
    }

    deleteClick(id) {
        let confirmed = false;
        if (confirm("Are you sure?")) {

            Helpers.setLoading(true);
            this._countryService.CountryDelete(id).subscribe(
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
        // console.log(confirmed)
        // return confirmed;
    }

}
