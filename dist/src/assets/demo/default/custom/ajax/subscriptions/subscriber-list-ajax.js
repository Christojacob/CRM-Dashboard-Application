//== Class definition

var DatatableRemoteAjaxDemo = function() {
    //== Private functions
  
    // basic demo
    var demo = function() {
  
      var datatable = $('.m_datatable').mDatatable({
        // datasource definition
        data: {
          type: 'remote',
          source: {
            read:{
              method:'GET',
              url:'http://www.mocky.io/v2/5b2a4cc230000066009cd2f3'
            }
          },
          pageSize: 10,
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

        rows: {
          // auto hide columns, if rows overflow
          autoHide: true,
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
            field: 'PublicationName',
            title: 'Publication Name',
            // sortable: 'asc', // default sort
            filterable: false, // disable or enable filtering
            width: 150,
          }, {
            field: 'SubscriberName',
            title: 'Subscriber Name',
            width: 150,
          }, {
            field: 'Address',
            title: 'Address',
            width: 100
          }, {
            field: 'Email',
            title: 'Email',
            width: 150
          }, {
            field: 'State',
            title: 'State',
            width: 150
          }, {
            field: 'CountryName',
            title: 'Country Name',
            width: 150
          }, {
            field: 'ZipCode',
            title: 'Zip Code',
            width: 150
          }, {
            field: 'AgentName',
            title: 'Agent Name',
            width: 150
          }, {
            field: 'year',
            title: 'Year',
            width: 150
          }, {
            field: 'Amount',
            title: 'Amount',
            width: 150
          }, {
            field: 'RegDate',
            title: 'Reg Date',
            width: 150
          }, {
            field: 'PaymentType',
            title: 'Payment Type',
            width: 150
          }, {
            field: 'PaymentStatus',
            title: 'Payment Status',
            // callback function support for column rendering
            template: function(row) {
              var status = {
                1: {'title': 'Completed', 'class': ' m-badge--success'},
                2: {'title': 'Waiting', 'class': ' m-badge--warning'},
              };
              return '<span class="m-badge ' + status[row.PaymentStatus].class + ' m-badge--wide">' + status[row.PaymentStatus].title + '</span>';
            },
          }, {
            field: 'DueIssues',
            title: 'Due Issues',
            width: 150
          }, {
            field: 'ModOfSub',
            title: 'Mod Of Subscription',
            width: 150
          }, {
            field: 'Renew',
            title: 'Renew',
            // callback function support for column rendering
            template: function(row) {
              var status = {
                0: {'title': 'Yes', 'class': ' m-badge--success'},
                1: {'title': 'No', 'class': ' m-badge--warning'},
              };
              return '<span class="m-badge ' + status[row.Renew].class + ' m-badge--wide">' + status[row.Renew].title + '</span>';
            },
          },{
            field: 'Status',
            title: 'Status',
            // callback function support for column rendering
            template: function(row) {
              var status = {
                1: {'title': 'Active', 'class': ' m-badge--success'},
                2: {'title': 'Deactive', 'class': ' m-badge--warning'},
              };
              return '<span class="m-badge ' + status[row.Status].class + ' m-badge--wide">' + status[row.Status].title + '</span>';
            },
          }, {
            field: 'Actions',
            width: 110,
            title: 'Actions',
            sortable: false,
            overflow: 'visible',
            template: function (row, index, datatable) {
              var dropup = (datatable.getPageSize() - index) <= 4 ? 'dropup' : '';
              return '\
                          <div class="dropdown ' + dropup + '">\
                              <a href="#" class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown">\
                                  <i class="la la-ellipsis-h"></i>\
                              </a>\
                                <div class="dropdown-menu dropdown-menu-right">\
                                  <a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>\
                                  <a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>\
                                  <a class="dropdown-item" href="#"><i class="la la-print"></i> Generate Report</a>\
                                </div>\
                          </div>\
                          <a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
                              <i class="la la-edit"></i>\
                          </a>\
                          <a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
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
  
    };
  
    return {
      // public functions
      init: function() {
        demo();
      },
    };
  }();
  
  jQuery(document).ready(function() {
    DatatableRemoteAjaxDemo.init();
  });