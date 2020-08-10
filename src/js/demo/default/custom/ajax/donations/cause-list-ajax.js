//== Class definition

var DatatableRemoteAjaxDemo = function() {
    //== Private functions
  
    var mainTab = function() {
  
      var datatable = $('.m_datatable').mDatatable({
        // datasource definition
        data: {
          type: 'remote',
          source: {
            read:{
              method:'GET',
              url:'http://www.mocky.io/v2/5b2e0a7b2f000060006a284f'
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

        detail: {
            title: 'Load sub table',
            content: subTab,
          },
  
        // columns definition
        columns: [
          {
            field: 'RecordID',
            title: '',
            sortable: false, // disable sort for this column
            width: 40,
            selector: false,
            textAlign: 'center',
          }, {
            field: 'Title',
            title: 'Cause title',
            sortable: 'asc',
            filterable: false, // disable or enable filtering
            width: 150,
          }, {
            field: 'Recurring',
            title: 'Recurring',
            width: 80,
            template: function(row){
                if(row.Recurring==0){
                    return "NO";
                }else{
                    return "YES";
                }
            }
          }, {
            field: 'AnyAmount',
            title: 'If Any Amount',
            width: 80,
            template: function(row){
                if(row.AnyAmount==0){
                    return "NO";
                }else{
                    return "YES";
                }
            }
          }, {
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

    subTab = function(e){
        console.log(e.detailCell)
        $(e.detailCell).empty();
        var divx = $('<div/>').attr('id', 'child_data_local_' + e.data.RecordID).appendTo(e.detailCell);
        
        var sites = "<div><b> Applicable websites </b> ";

        $.each(e.data.SubApplication,function(key,value){
            sites = sites + ' <span class="m-badge  m-badge--success m-badge--wide">'+value.SiteName+'</span>';
        });

        sites = sites+" </div>";
        
        var country = "<div><b> Applicable countries </b> ";
        $.each(e.data.Counties,function(key,value){
            country = country + ' <span class="m-badge  m-badge--success m-badge--wide">'+value.CountryName+'</span>';
        });
        country = country+" </div>";

        if(e.data.SingleAccount==0){
            
        }else{

        }
        divx.html(country);
        divx.append(sites);
    }
  
    return {
      // public functions
      init: function() {
        mainTab();
      },
    };
  }();
  
  jQuery(document).ready(function() {
    DatatableRemoteAjaxDemo.init();
  });