/* jshint unused: true, laxcomma: true, freeze: true, strict: true */
(function($) {
  'use strict';
  var dashboard = {
    init: function() {
      this.dataTables = $('.data-table');
      if (this.dataTables.length < 1) return;
      this.setupDataTables();
    },
    sort: function(table) {
      var r = [];
      $(table).find('th').each(function(){
        r.push({ 'bSortable':  ! $(this).hasClass('no-sorting') });
      });
      return r;
    },
    setupDataTables: function() {
      $.each( this.dataTables, $.proxy(function (i, table) {
        var isHistory       = $(table).hasClass('data-table-history');

        if ( isHistory ) {
          this.history(table);
        } else {
          this.stats(table);
        }
      },this));
    },
    history: function(table) {
      $(table).dataTable({
        sPaginationType: "bs_full",
        bLengthChange: false,
        bAutoWidth: false,
        bFilter: false,
        bInfo: false,
      });
    },
    stats: function(table) {
      var columnCount     = $(table).find('th').length;
      var sortableColumns = this.sort(table);
      $(table).dataTable({
        sPaginationType: "bs_full",
        bLengthChange: false,
        bAutoWidth: false,
        aoColumns: sortableColumns,
        aaSorting: [[ columnCount - 1, "desc" ]],
        fnDrawCallback: function() {
          $('.dataTables_filter input').addClass('form-control input-sm');
        }
      });
    }
  };

  dashboard.init();
})(jQuery);
