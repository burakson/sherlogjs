/* jshint unused: true, laxcomma: true, freeze: true, strict: true */
(function($) {
  'use strict';

  var dashboard = {

    /**
     * Initialize the dashboard UI.
     *
     * @return  void
     */
    init: function() {
      this.dataTables = $('.data-table');
      if (this.dataTables.length < 1) {
        return;
      }
      this.setupDataTables();
    },

    /**
     * Iterate each table columns to create sortable array.
     *
     * @param   table   Element object
     * @return  array
     */
    sort: function(table) {
      var r = [];
      $(table).find('th').each(function(){
        r.push({ 'bSortable':  ! $(this).hasClass('no-sorting') });
      });
      return r;
    },

    /**
     * Setup datatables.
     *
     * @return  void
     */
    setupDataTables: function() {
      $.each( this.dataTables, $.proxy(function (i, table) {
        this.stats(table);
      },this));
    },

    /**
     * Initializes datatables by calling the plugin with desired options.
     *
     * @return  void
     */
    stats: function(table) {
      var columnCount = $(table).find('th').length;
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
