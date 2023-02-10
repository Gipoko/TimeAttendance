
$(document).ready(function () {
  var $data;
  var $tblAllowance;
  var $selectedTemp_id = 0;

  $('#tblEmployee tbody').on('click', '.btnEmployeePayroll', function () {
    $data = $(this).data();
    $selectedTemp_id = $data.id;
    $url = "/page/human-resources/employee/work/getWorkByTempID/*";
    $.ajax($url, {
      type: 'POST',
      dataType: 'JSON',
      data: { temp_id: $selectedTemp_id }
    }).then(function ($data) {

      $(".temp_id").val($data[0]['temp_id']);

      $("#payrollCurrentDivision").val($data[0]['rdivision_name']);
      $("#payrollCurrentDivUnit").val($data[0]['rdivision_sectionunit_name']);
      $("#payrollCurrentJobPosition").val($data[0]['rposition_name']);
      $("#payrollCurrentEmploymentType").val($data[0]['remployment_type_desc']);


      $("#payrollCurrentGrade").val($data[0]['rgradestep_gradeno']);
      $("#payrollCurrentStep").val($data[0]['rgradestep_stepno']);
      $("#payrollCurrentSalary").val($data[0]['rgradestep_salary']);

      window.$modalEmployeePayroll.modal('show');
      loadAllowances($selectedTemp_id);
      loadDeductions($selectedTemp_id);
      loadEarnings($selectedTemp_id);
      clearForm();
    });
  });

  function clearForm() {

    $btnEarningAdd.html('Add');
    $btnAllowanceAdd.html('Add');
    $btnDeductionAdd.html('Add');

    $("#rearning_code").val('');
    $("#rearning_default_amt").val('');
    $("#rearning_percentage_tax").val('');
    $("#rearning_additional").val('');
    $("#rearning_taxtotal").val('');
    $("#rearning_addtotal").val('');
    $("#rearning_start_date").val('');
    $("#rearning_end_date").val('');

    $("#rallowance_code").val('');
    $("#rallowance_default_amt").val('');
    $("#rallowance_percentage_tax").val('');
    $("#rallowance_additional").val('');
    $("#rallowance_taxtotal").val('');
    $("#rallowance_addtotal").val('');
    $("#rallowance_start_date").val('');
    $("#rallowance_end_date").val('');

    $("#rdeduction_code").val('');
    $("#rdeduction_default_amt").val('');
    $("#rdeduction_percentage_tax").val('');
    $("#rdeduction_taxtotal").val('');
    $("#rdeduction_additional").val('');
    $("#rdeduction_addtotal").val('');
    $("#rdeduction_start_date").val('');
    $("#rdeduction_end_date").val('');
  };

  // allowance js
  var $btnAllowanceAdd = $("#btnAllowanceAdd");
  var $frmAllowance = $("#frmAllowance");
  var $lastAllowanceCmd = 1;
  var $selectedID = 0;
  $tblAllowance = $("#tblAllowance").DataTable({
    "oLanguage": {
      "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
    },
    "responsive": true,
    "processing": true,
    columns: [
      { data: "temp_allowance_id", title: "Id", "visible": true },
      { data: "rallowance_code", title: "Code", "visible": true },
      { data: "rallowance_default_amt", title: "Default Amount", "visible": true },
      { data: "rallowance_percentage_tax", title: "Tax%", "visible": true },
      { data: "rallowance_taxtotal", title: "Total", "visible": true },
      { data: "rallowance_additional", title: "Additional", "visible": true },
      { data: "rallowance_addtotal", title: "TaxTotal", "visible": true },
      { data: "rallowance_start_date", title: "Start Date", "visible": true },
      { data: "rallowance_end_date", title: "End Date", "visible": true },
      { data: "action", title: "Action" }
    ]
  }
  );

  function loadAllowances($id) {
    $btnAllowanceAdd.html('Add');
    $("#rallowance_code").val('');

    //tax computation
    $("#rallowance_percentage_tax").change(function () {
      var adamount = $("#rallowance_default_amt").val();
      var atax = $(this).val();
      var atotal = adamount * atax;
      $("#rallowance_taxtotal").val(atotal);
    });


    $("#rallowance_additional").change(function () {
      var aptax = $("#rallowance_taxtotal").val();
      var aadditional = $(this).val();
      var ataxtotal = parseInt(aptax) + parseInt(aadditional);
      $("#rallowance_addtotal").val(ataxtotal);
    });


    //load allowance
    $url = "/page/human-resources/employee/_allowance/getAllowanceList/*";
    $.ajax($url, {
      type: 'POST',
      dataType: 'JSON',
      data: { temp_id: $id },
    }).then(function ($data) {

      $tblAllowance.clear().rows.add($data.allowances).draw();
    });
  }



  $btnAllowanceAdd.on('click', function (e) {

    if ($("#rallowance_code").val() === '') {

      return false;
    }
    if ($lastAllowanceCmd == 1) {
      $url = "/page/human-resources/employee/_allowance/add/*";
      $data = {
        temp_id: $selectedTemp_id,
        rallowance_code: $("#rallowance_code").val(),
        rallowance_default_amt: $("#rallowance_default_amt").val(),
        rallowance_percentage_tax: $("#rallowance_percentage_tax").val(),
        rallowance_taxtotal: $("#rallowance_taxtotal").val(),
        rallowance_additional: $("#rallowance_additional").val(),
        rallowance_addtotal: $("#rallowance_addtotal").val(),
        rallowance_start_date: $("#rallowance_start_date").val(),
        rallowance_end_date: $("#rallowance_end_date").val()

      };
    } else if ($lastAllowanceCmd == 2) {
      $url = "/page/human-resources/employee/_allowance/edit/*";
      $data = {
        temp_id: $selectedTemp_id,
        temp_allowance_id: $selectedID,
        rallowance_code: $("#rallowance_code").val(),
        rallowance_default_amt: $("#rallowance_default_amt").val(),
        rallowance_percentage_tax: $("#rallowance_percentage_tax").val(),
        rallowance_taxtotal: $("#rallowance_taxtotal").val(),
        rallowance_additional: $("#rallowance_additional").val(),
        rallowance_addtotal: $("#rallowance_addtotal").val(),
        rallowance_start_date: $("#rallowance_start_date").val(),
        rallowance_end_date: $("#rallowance_end_date").val()

      };
    } else if ($lastAllowanceCmd == 3) {
      $url = "/page/human-resources/employee/_allowance/delete/*";
      $data = {
        temp_id: $selectedTemp_id,
        temp_allowance_id: $selectedID,
        rallowance_code: $("#rallowance_code").val(),
        rallowance_default_amt: $("#rallowance_default_amt").val(),
        rallowance_percentage_tax: $("#rallowance_percentage_tax").val(),
        rallowance_taxtotal: $("#rallowance_taxtotal").val(),
        rallowance_additional: $("#rallowance_additional").val(),
        rallowance_addtotal: $("#rallowance_addtotal").val(),
        rallowance_start_date: $("#rallowance_start_date").val(),
        rallowance_end_date: $("#rallowance_end_date").val()
      }
    }

    $btnAllowanceAdd.html('Add');

    // alert($url);
    $.ajax($url, {
      type: 'POST',
      dataType: 'JSON',
      data: $data
    }).then(function ($data) {
      // alert($("#rallowance_code").val());
      console.log('jun', $data);
      $tblAllowance.clear().rows.add($data.allowances).draw();

      $("#rallowance_code").val('');
      $("#rallowance_default_amt").val('');
      $("#rallowance_percentage_tax").val('');
      $("#rallowance_taxtotal").val('');
      $("#rallowance_additional").val('');
      $("#rallowance_addtotal").val('');
      $("#rallowance_start_date").val('');
      $("#rallowance_end_date").val('');
      $lastAllowanceCmd = 1;
      $selectedID = 0;

    });
    return false;
  });

  $('#tblAllowance tbody').on('click', '.btnAllowanceEdit', function () {
    $data = $(this).data();
    $selectedID = $data.id;
    $("#rallowance_code").val($data.rallowance_code);
    $("#rallowance_default_amt").val($data.rallowance_default_amt);
    $("#rallowance_percentage_tax").val($data.rallowance_percentage_tax);
    $("#rallowance_taxtotal").val($data.rallowance_taxtotal);
    $("#rallowance_additional").val($data.rallowance_additional);
    $("#rallowance_addtotal").val($data.rallowance_addtotal);
    $("#rallowance_start_date").val($data.rallowance_start_date);
    $("#rallowance_end_date").val($data.rallowance_end_date);
    $btnAllowanceAdd.html('Update');
    $lastAllowanceCmd = 2;
  });

  $('#tblAllowance tbody').on('click', '.btnAllowanceDelete', function () {
    $data = $(this).data();
    $selectedID = $data.id;
    $("#rallowance_code").val($data.rallowance_code);
    $("#rallowance_default_amt").val($data.rallowance_default_amt);
    $("#rallowance_percentage_tax").val($data.rallowance_percentage_tax);
    $("#rallowance_taxtotal").val($data.rallowance_taxtotal);
    $("#rallowance_additional").val($data.rallowance_additional);
    $("#rallowance_addtotal").val($data.rallowance_addtotal);
    $("#rallowance_start_date").val($data.rallowance_start_date);
    $("#rallowance_end_date").val($data.rallowance_end_date);
    $btnAllowanceAdd.html('Delete');
    $lastAllowanceCmd = 3;
  });


  // deduction js



  var $btnDeductionAdd = $("#btnDeductionAdd");
  var $frmDeduction = $("#frmDeduction");
  var $lastCmd = 1;
  var $selectedID = 0;
  var $tblDeduction = $("#tblDeduction").DataTable({
    "oLanguage": {
      "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
    },
    "responsive": true,
    "processing": true,
    columns: [
      { data: "temp_deduction_id", title: "Id", "visible": true },
      { data: "rdeduction_code", title: "Code", "visible": true },
      { data: "rdeduction_default_amt", title: "Default Amount", "visible": true },
      { data: "rdeduction_percentage_tax", title: "Tax%", "visible": true },
      { data: "rdeduction_taxtotal", title: "Total", "visible": true },
      { data: "rdeduction_additional", title: "Additional", "visible": true },
      { data: "rdeduction_addtotal", title: "TaxTotal", "visible": true },
      { data: "rdeduction_start_date", title: "Start Date", "visible": true },
      { data: "rdeduction_end_date", title: "End Date", "visible": true },
      { data: "action", title: "Action" }
    ]
  }
  );

  function loadDeductions($id) {
    $btnDeductionAdd.html('Add');
    $("#rdeduction_code").val('');


    //tax computation
    $("#rdeduction_percentage_tax").change(function () {
      var ddamount = $("#rdeduction_default_amt").val();
      var dtax = $(this).val();
      var dtotal = ddamount * dtax;
      $("#rdeduction_taxtotal").val(dtotal);
    });


    $("#rdeduction_additional").change(function () {
      var dptax = $("#rdeduction_taxtotal").val();
      var dadditional = $(this).val();
      var dtaxtotal = parseInt(dptax) + parseInt(dadditional);
      $("#rdeduction_addtotal").val(dtaxtotal);
    });


    //load deduction
    $url = "/page/human-resources/employee/deduction/getDeductionsList/*";
    $.ajax($url, {
      type: 'POST',
      dataType: 'JSON',
      data: { temp_id: $id }
    }).then(function ($data) {
      console.log($data);
      $tblDeduction.clear().rows.add($data.deductions).draw();
    });
  }



  $btnDeductionAdd.on('click', function (e) {
    if ($("#rdeduction_code").val() == '') {
      return false;
    }
    if ($lastCmd == 1) {
      $url = "/page/human-resources/employee/deduction/add/*";
      $data = {
        temp_id: $selectedTemp_id,
        rdeduction_code: $("#rdeduction_code").val(),
        rdeduction_default_amt: $("#rdeduction_default_amt").val(),
        rdeduction_percentage_tax: $("#rdeduction_percentage_tax").val(),
        rdeduction_taxtotal: $("#rdeduction_taxtotal").val(),
        rdeduction_additional: $("#rdeduction_additional").val(),
        rdeduction_addtotal: $("#rdeduction_addtotal").val(),
        rdeduction_start_date: $("#rdeduction_start_date").val(),
        rdeduction_end_date: $("#rdeduction_end_date").val()

      };
    } else if ($lastCmd == 2) {
      $url = "/page/human-resources/employee/deduction/edit/*";
      $data = {
        temp_id: $selectedTemp_id,
        temp_deduction_id: $selectedID,
        rdeduction_code: $("#rdeduction_code").val(),
        rdeduction_default_amt: $("#rdeduction_default_amt").val(),
        rdeduction_percentage_tax: $("#rdeduction_percentage_tax").val(),
        rdeduction_taxtotal: $("#rdeduction_taxtotal").val(),
        rdeduction_additional: $("#rdeduction_additional").val(),
        rdeduction_addtotal: $("#rdeduction_addtotal").val(),
        rdeduction_start_date: $("#rdeduction_start_date").val(),
        rdeduction_end_date: $("#rdeduction_end_date").val()

      };
    } else if ($lastCmd == 3) {
      $url = "/page/human-resources/employee/deduction/delete/*";
      $data = {
        temp_id: $selectedTemp_id,
        temp_deduction_id: $selectedID,
        rdeduction_code: $("#rdeduction_code").val(),
        rdeduction_default_amt: $("#rdeduction_default_amt").val(),
        rdeduction_percentage_tax: $("#rdeduction_percentage_tax").val(),
        rdeduction_taxtotal: $("#rdeduction_taxtotal").val(),
        rdeduction_additional: $("#rdeduction_additional").val(),
        rdeduction_addtotal: $("#rdeduction_addtotal").val(),
        rdeduction_start_date: $("#rdeduction_start_date").val(),
        rdeduction_end_date: $("#rdeduction_end_date").val()
      }
    }

    $btnDeductionAdd.html('Add');


    $.ajax($url, {
      type: 'POST',
      dataType: 'JSON',
      data: $data
    }).then(function ($data) {
      console.log('jun', $data);
      $tblDeduction.clear().rows.add($data.deductions).draw();

      $("#rdeduction_code").val('');
      $("#rdeduction_default_amt").val('');
      $("#rdeduction_percentage_tax").val('');
      $("#rdeduction_taxtotal").val('');
      $("#rdeduction_additional").val('');
      $("#rdeduction_addtotal").val('');
      $("#rdeduction_start_date").val('');
      $("#rdeduction_end_date").val('');
      $lastCmd = 1;
      $selectedID = 0;
    });
  });

  $('#tblDeduction tbody').on('click', '.btnDeductionEdit', function () {
    $data = $(this).data();
    $selectedID = $data.id;
    $("#rdeduction_code").val($data.rdeduction_code);
    $("#rdeduction_default_amt").val($data.rdeduction_default_amt);
    $("#rdeduction_percentage_tax").val($data.rdeduction_percentage_tax);
    $("#rdeduction_taxtotal").val($data.rdeduction_taxtotal);
    $("#rdeduction_additional").val($data.rdeduction_additional);
    $("#rdeduction_addtotal").val($data.rdeduction_addtotal);
    $("#rdeduction_start_date").val($data.rdeduction_start_date);
    $("#rdeduction_end_date").val($data.rdeduction_end_date);
    $btnDeductionAdd.html('Update');
    $lastCmd = 2;
  });

  $('#tblDeduction tbody').on('click', '.btnDeductionDelete', function () {
    $data = $(this).data();
    $selectedID = $data.id;
    $("#rdeduction_code").val($data.rdeduction_code);
    $("#rdeduction_default_amt").val($data.rdeduction_default_amt);
    $("#rdeduction_percentage_tax").val($data.rdeduction_percentage_tax);
    $("#rdeduction_taxtotal").val($data.rdeduction_taxtotal);
    $("#rdeduction_additional").val($data.rdeduction_additional);
    $("#rdeduction_addtotal").val($data.rdeduction_addtotal);
    $("#rdeduction_start_date").val($data.rdeduction_start_date);
    $("#rdeduction_end_date").val($data.rdeduction_end_date);
    $btnDeductionAdd.html('Delete');
    $lastCmd = 3;
  });



  // earning js



  var $btnEarningAdd = $("#btnEarningAdd");
  var $frmEarning = $("#frmEarning");
  var $lastCmd = 1;
  var $selectedID = 0;
  var $tblEarning = $("#tblEarning").DataTable(
    {
      "oLanguage": {
        "sInfo": "_START_ to _END_ of _TOTAL_ rows",// text you want show for info section
      },
      "responsive": true,
      "processing": true,
      columns: [
        { data: "temp_earning_id", title: "Id", "visible": true },
        { data: "rearning_code", title: "Code", "visible": true },
        { data: "rearning_default_amt", title: "Default Amount", "visible": true },
        { data: "rearning_percentage_tax", title: "Tax%", "visible": true },
        { data: "rearning_taxtotal", title: "Total", "visible": true },
        { data: "rearning_additional", title: "Additional", "visible": true },
        { data: "rearning_addtotal", title: "TaxTotal", "visible": true },
        { data: "rearning_start_date", title: "Start Date", "visible": true },
        { data: "rearning_end_date", title: "End Date", "visible": true },
        { data: "action", title: "Action" }
      ]
    }
  );

  $btnEarningAdd.html('Add');
  $("#rearning_code").val('');

  //tax computation

  $("#rearning_percentage_tax").change(function () {
    var ramount = $("#rearning_default_amt").val();
    var rtax = $(this).val();
    var rtotal = ramount * rtax;
    $("#rearning_taxtotal").val(rtotal);
  });


  $("#rearning_additional").change(function () {
    var rptax = $("#rearning_taxtotal").val();
    var radditional = $(this).val();
    var rtaxtotal = parseInt(rptax) + parseInt(radditional);
    $("#rearning_addtotal").val(rtaxtotal);
  });

  //load the employee earnings
  function loadEarnings($id) {
    $url = "/page/human-resources/employee/earning/list/*";
    $.ajax($url, {
      type: 'POST',
      dataType: 'JSON',
      data: { temp_id: $id }
    }).then(function ($data) {
      console.log($data);
      $tblEarning.clear().rows.add($data.earnings).draw();
    });
  }


  $btnEarningAdd.on('click', function (e) {
    if ($("#rearning_code").val() == '') {
      return false;
    }
    if ($lastCmd == 1) {
      $url = "/page/human-resources/employee/earning/add/*";
      $data = {
        temp_id: $(".temp_id").val(),
        rearning_code: $("#rearning_code").val(),
        rearning_default_amt: $("#rearning_default_amt").val(),
        rearning_percentage_tax: $("#rearning_percentage_tax").val(),
        rearning_taxtotal: $("#rearning_taxtotal").val(),
        rearning_additional: $("#rearning_additional").val(),
        rearning_addtotal: $("#rearning_addtotal").val(),
        rearning_start_date: $("#rearning_start_date").val(),
        rearning_end_date: $("#rearning_end_date").val()
      };
    } else if ($lastCmd == 2) {
      $url = "/page/human-resources/employee/earning/edit/*";
      $data = {
        temp_id: $selectedTemp_id,
        temp_earning_id: $selectedID,
        rearning_code: $("#rearning_code").val(),
        rearning_default_amt: $("#rearning_default_amt").val(),
        rearning_percentage_tax: $("#rearning_percentage_tax").val(),
        rearning_taxtotal: $("#rearning_taxtotal").val(),
        rearning_additional: $("#rearning_additional").val(),
        rearning_addtotal: $("#rearning_addtotal").val(),
        rearning_start_date: $("#rearning_start_date").val(),
        rearning_end_date: $("#rearning_end_date").val()

      };
    } else if ($lastCmd == 3) {
      $url = "/page/human-resources/employee/earning/delete/*";
      $data = {
        temp_id: $selectedTemp_id,
        temp_earning_id: $selectedID,
        rearning_code: $("#rearning_code").val(),
        rearning_default_amt: $("#rearning_default_amt").val(),
        rearning_percentage_tax: $("#rearning_percentage_tax").val(),
        rearning_taxtotal: $("#rearning_taxtotal").val(),
        rearning_additional: $("#rearning_additional").val(),
        rearning_addtotal: $("#rearning_addtotal").val(),
        rearning_start_date: $("#rearning_start_date").val(),
        rearning_end_date: $("#rearning_end_date").val()
      }
    }

    $btnEarningAdd.html('Add');


    $.ajax($url, {
      type: 'POST',
      dataType: 'JSON',
      data: $data
    }).then(function ($data) {
      console.log('jun', $data);
      $tblEarning.clear().rows.add($data.earnings).draw();

      $("#rearning_code").val('');
      $("#rearning_default_amt").val('');
      $("#rearning_percentage_tax").val('');
      $("#rearning_taxtotal").val('');
      $("#rearning_additional").val('');
      $("#rearning_addtotal").val('');
      $("#rearning_start_date").val('');
      $("#rearning_end_date").val('');
      $lastCmd = 1;
      $selectedID = 0;
    });
  });

  $('#tblEarning tbody').on('click', '.btnEarningEdit', function () {
    $data = $(this).data();
    $selectedID = $data.id;
    $("#rearning_code").val($data.rearning_code);
    $("#rearning_default_amt").val($data.rearning_default_amt);
    $("#rearning_percentage_tax").val($data.rearning_percentage_tax);
    $("#rearning_taxtotal").val($data.rearning_taxtotal);
    $("#rearning_additional").val($data.rearning_additional);
    $("#rearning_addtotal").val($data.rearning_addtotal);
    $("#rearning_start_date").val($data.rearning_start_date);
    $("#rearning_end_date").val($data.rearning_end_date);
    $btnEarningAdd.html('Update');
    $lastCmd = 2;
  });

  $('#tblEarning tbody').on('click', '.btnEarningDelete', function () {
    $data = $(this).data();
    $selectedID = $data.id;
    $("#rearning_code").val($data.rearning_code);
    $("#rearning_default_amt").val($data.rearning_default_amt);
    $("#rearning_percentage_tax").val($data.rearning_percentage_tax);
    $("#rearning_taxtotal").val($data.rearning_taxtotal);
    $("#rearning_additional").val($data.rearning_additional);
    $("#rearning_addtotal").val($data.rearning_addtotal);
    $("#rearning_start_date").val($data.rearning_start_date);
    $("#rearning_end_date").val($data.rearning_end_date);
    $btnEarningAdd.html('Delete');
    $lastCmd = 3;
  });
});