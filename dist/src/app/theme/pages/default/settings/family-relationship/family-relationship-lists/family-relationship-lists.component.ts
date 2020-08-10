import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../../helpers';
import { Router } from "@angular/router";
import { FormBuilder, Validators } from '@angular/forms';

import { FamilyRelationshipService } from '../family-relationship.service';

declare let $: any;

@Component({
    selector: 'app-family-relationship-lists',
    templateUrl: './family-relationship-lists.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class FamilyRelationshipListsComponent implements OnInit, AfterViewInit {

    createForm: any;
    formError = false;
    EditId: any;

    constructor(private helper: Helpers, private router: Router, private _familyService: FamilyRelationshipService, public formBuilder: FormBuilder) {
        this.formInit();
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
                            url: apiUrl + 'settings/family-relationship',
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
                        width: 40,
                        selector: false,
                        textAlign: 'center',
                    }, {
                        field: 'RelationshipName',
                        title: 'Name',
                        sortable: 'asc', // default sort
                        filterable: false, // disable or enable filtering
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
                              <a id="edit-button-'+ row.RecordID + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill edit-button" data="' + row.RecordID + '" data-family="' + row.RelationshipName + '" title="Edit details">\
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
                    let value = $(this).attr('data-family');
                    mm.editClick(id, value);
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
                console.log('reloaded')
                datatable.reload()
            }
        })
    }

    formInit() {
        this.createForm = this.formBuilder.group({
            RelationshipName: ['', Validators.required],
        });
    }

    editClick(id, value) {
        $('#m_modal_5').modal('show');
        this.EditId = id;
        this.createForm = this.formBuilder.group({
            RelationshipName: [value, Validators.required],
        });
    }

    update() {
        this.formError = true;
        if (!this.createForm.valid) {
            Helpers.DisplayMsg({ status: 'error', msg: 'Please fill all mandatory fields' })
        } else {
            Helpers.setLoading(true);
            this._familyService.familyUpdate(this.createForm.value, this.EditId).subscribe(
                data => {
                    Helpers.setLoading(false);
                    Helpers.DisplayMsg(data)
                    this.router.routeReuseStrategy.shouldReuseRoute = function() { return false; };
                    let currentUrl = this.router.url + '?';
                    this.router.navigateByUrl(currentUrl)
                        .then(() => {
                            $('#m_modal_5').modal('hide');
                            this.router.navigated = false;
                            this.router.navigate([this.router.url]);
                        });
                },
                error => {
                    Helpers.setLoading(false);
                    Helpers.DisplayMsg({ status: 'error', msg: 'Something when wrong.Please try later' })
                });
        }
    }

    deleteClick(id) {
        let confirmed = false;
        if (confirm("Are you sure?")) {

            Helpers.setLoading(true);
            this._familyService.FamilyDelete(id).subscribe(
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
