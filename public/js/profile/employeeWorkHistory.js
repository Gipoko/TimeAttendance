// $(function () {
  var $tblEmployeeWorkHistory;

  $tblEmployeeWorkHistory = $('#tblEmployeeWorkHistory').DataTable({
    "bInfo" : false,
    "responsive": true,
    "processing": true, 
    "autoWidth": true,
    "searching": false,
    "paging": false,
    "ordering": false,
    columns: [
      { data: "temp_work_id", title: "ID" },
      { data: "division", title: "Division" },
      { data: "unit", title: "Section/Unit" },
      { data: "position", title: "Position" },
      { data: "grade", title: "Grade" },
      { data: "step", title: "Step" },
      { data: "salary", title: "Salary" },
      { data: "empType", title: "Employment Type" },
      { data: "reportingTo", title: "Reporting To" }
    ]
  });
  
  //load the family members
  $url = "/page/employee/detail/work/history/*";
  $.ajax($url, {
    type: 'POST',
    dataType: 'JSON'
  }).then(function ($data) {
    // reload family members
    $tblEmployeeWorkHistory.clear().rows.add($data.workhistory).draw();
  
  });