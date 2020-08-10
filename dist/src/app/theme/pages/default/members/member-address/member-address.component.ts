import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Helpers } from '../../../../../helpers';

declare let $: any;

@Component({
    selector: 'app-member-address',
    templateUrl: './member-address.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class MemberAddressComponent implements OnInit, AfterViewInit {

    routeParams: any;

    constructor(
        private activeRoute: ActivatedRoute,
        private helper: Helpers
    ) { }

    ngOnInit() {
        this.routeParams = this.activeRoute.snapshot.parent.params;
    }

    addAddressInit() {
        $('#m_modal_6').modal('show');
    }


    ngAfterViewInit() {
        let mm = this;
        let user = JSON.parse(localStorage.getItem('currentUser'));
        let apiUrl = this.helper.ApiBaseUrl;

        $(document).ready(function() {

            let datatable = (<any>$('.m_member_address')).mDatatable({
                // datasource definition
                data: {
                    type: 'remote',
                    source: {
                        read: {
                            method: 'GET',
                            url: apiUrl + `backend/member-user/address/${mm.routeParams.MemberId}`,
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
                        field: 'Address1',
                        title: 'Address',
                    }, {
                        field: 'Address2',
                        title: 'Address',
                        width: 150,
                    }, {
                        field: 'City',
                        title: 'City',
                        width: 150,
                    }, {
                        field: 'Country',
                        title: 'Country',
                        width: 150,
                    }, {
                        field: 'State',
                        title: 'State',
                        width: 150,
                    }, {
                        field: 'Zip',
                        title: 'Zip',
                        width: 150,
                    }, {
                        field: 'SourceApplication',
                        title: 'Source Application',
                        width: 150,
                    }, {
                        field: 'AddressType',
                        title: 'Address Type',
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
