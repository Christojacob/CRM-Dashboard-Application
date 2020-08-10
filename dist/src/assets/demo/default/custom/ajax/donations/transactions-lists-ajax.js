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
              url:'http://www.mocky.io/v2/5b30b41a3100009909129042'
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
            field: 'MemberName',
            title: 'Doner Name',
            // sortable: 'asc', // default sort
            filterable: false, // disable or enable filtering
            width: 150,
            template:function(row){
                return row.User.Name;
            }
          }, {
            field: 'CountryCode',
            title: 'Country',
            width: 80,
            template: function(row){
                return row.Country.CountryCode;
            }            
          }, {
            field: 'Cause',
            title: 'Cause',
            width: 100
          }, {
            field: 'RecurringPeriod',
            title: 'Recurring Period',
            width: 100
          }, {
            field: 'Amount',
            title: 'Amount',
            width: 100
          }, {
            field: 'Currency',
            title: 'Currency',
            width: 100,
            template : '{{Currency}} ({{PaymentCountry}})'
          }, {
            field: 'Date',
            title: 'Date',
            width: 100
          }, {
            field: 'TransactionId',
            title: 'Transaction ID',
            width: 100
          }, {
            field: 'PaymentStatus',
            title: 'Payment Status',
            // callback function support for column rendering
            template: function(row) {
              if(row.PaymentStatus=='Success'){
                return '<span class="m-badge m-badge--success m-badge--wide">' + row.PaymentStatus + '</span>';
            }else{
                return '<span class="m-badge m-badge--warning m-badge--wide">' + row.PaymentStatus + '</span>';
              }
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