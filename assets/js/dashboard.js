$(function() {
  var dashboard = {
    init: function() {
      this.dataTable = $('.data-table');
      if (this.dataTable.length < 1) return;
      this.setupDataTable();
    },
    sort: function() {
      var r = [];
      this.dataTable.find('th').each(function(){
        r.push({ 'bSortable':  ! $(this).hasClass('no-sorting') });
      });
      return r;
    },
    setupDataTable: function() {
      var columnCount     = this.dataTable.find('th').length;
      var sortableColumns = this.sort();

      this.dataTable.dataTable({
        "sPaginationType": "bs_full",
        "bLengthChange": false,
        "bAutoWidth": false,
        "aoColumns": sortableColumns,
        "aaSorting": [[ columnCount - 1, "desc" ]],
        fnDrawCallback: function() {
          $('.dataTables_filter input').addClass('form-control input-sm');
        }
      });
    }
  }

  dashboard.init();
});
