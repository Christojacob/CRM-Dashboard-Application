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
            url:'http://www.mocky.io/v2/5b290ecc2f00009000f55ff9'
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
          field: 'CountryName',
          title: 'Name',
          // sortable: 'asc', // default sort
          filterable: false, // disable or enable filtering
          width: 150,
          // basic templating support for column rendering,
          template: '{{CountryName}}',
        }, {
          field: 'CountryCode',
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
          template: function(){
            var number = mUtil.getRandomInt(1, 5);
            var currencysymbol = {
              1:{'title':'currency','symbol':'fa-euro-sign'},
              2:{'title':'currency','symbol':'fa-dollar-sign'},
              3:{'title':'currency','symbol':'fa-pound-sign'},
              4:{'title':'currency','symbol':'fa-rupee-sign'},
              5:{'title':'currency','symbol':'fa-yen-sign'}
            }
            return '<i class="fa '+currencysymbol[number].symbol+'"></i>';
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