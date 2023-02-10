window.day = 22;
window.totalAttendance = 0;
window.totaldeduction = 0;


let nTotalDeductions = 0;
let nPayrollCurrentSalary = 0;
let nBasicSalary = 0;
let nDaily = 0;
let nTotalEarnings = 0;
let nGrossIncome = 0;
let nTotalAllowance = 0;
let nDailyRate = 0;
let minuteRate = 0;
let nTotalWorkingDays = 22;
let nTotalNetPay = 0;
let $EmpName
let wBioId;

var $modalDtr = $("#modalDtr");
var $modalGenerate = $("#modalGenerate");
var date = new Date(),
    month = date.toLocaleString('default', { month: 'long' });
$("#payroll-month").html(month);

var $tblGeneratePayroll = $("#tblGeneratePayroll").DataTable(
    {
        "oLanguage": {
            "sInfo": "START to END of TOTAL rows",// text you want show for info section
        },
        "responsive": true,
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "/page/payroll/generate-payroll/index/*",
            "type": "POST",
        },
        columns: [
            { data: "fullName", title: "Name", "visible": true },
            { data: "fileDetails", title: "Employment Type", "visible": true },
            { data: "divDetails", title: "Division Details", "visible": true },
            { data: "action", title: "Action" }
        ]
    }
);
$(document).ready(function () {

    $('#tblGeneratePayroll tbody').on('click', '.btnPaySlip', function (e) {
        e.preventDefault();
        $("#totalworkhours").html("0 Hours");
        $("#Undertime").html("0 Hours");
        var $selectedTemp_id = 0;
        $data = $(this).data();
        $selectedTemp_id = $data.id;
        console.log($tblGeneratePayroll);
        var $dataRow = $tblGeneratePayroll.row(this).data();
        if ($dataRow === undefined) {
            $dataRow = $tblGeneratePayroll.row($(this).parents('tr')).data();
        }
        $empType =$dataRow.emptype;
        var $bioId = $dataRow.bioId;
        setValues($dataRow);
        $("#modalTitle").html("Pay Slip");
        $("#btnPrint").html("Print");
        $modalGenerate.modal('show');

        wBioId = $bioId;
        loadGetDetailsAllowanceEarningsDeductions($selectedTemp_id,$bioId);

    });


    function setValues($TempDetails) {
        $("#fullName").html($TempDetails.fullName);
       
        $("#emptype").html( $empType);
    }


    $tblAllowance = $("#tblAllowance").DataTable({
        "responsive": true,
        "processing": true,
        "searching": false,
        "paging": false,
        "bInfo": false,

        columns: [

            { data: "rallowance_code", title: "Code", "visible": true },
            { data: "rallowance_default_amt", title: "Default Amount", "visible": true },
            { data: "rallowance_percentage_tax", title: "Tax%", "visible": true },
            { data: "rallowance_taxtotal", title: "Total", "visible": true },
            { data: "rallowance_additional", title: "Additional", "visible": true },
            { data: "rallowance_addtotal", title: "TaxTotal", "visible": true },
            { data: "total", title: "Total", "visible": true }

        ],
        "footerCallback": function (row, data, start, end, display) {
            var apia = this.api();

            // Remove the formatting to get integer data for summation
            var intVala = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            // Total over all pages
            window.totalallowance = apia
                .column(6)
                .data()
                .reduce(function (a, b) {
                    return intVala(a) + intVala(b);
                }, 0);

            nTotalAllowance = window.totalallowance;

            // Total over this page
            pageTotala = apia
                .column(6, { page: 'current' })
                .data()
                .reduce(function (a, b) {
                    return intVala(a) + intVala(b);
                }, 0);

            // Update footer
            $(apia.column(6).footer()).html(
                '₱' + window.totalallowance + ''
            );
            $("#totalallowance").html(window.totalallowance);
        }
    });


    //earning start
    $tblEarning = $("#tblEarning").DataTable({

        "responsive": true,
        "processing": true,
        "searching": false,
        "paging": false,
        "bInfo": false,

        columns: [

            { data: "rearning_code", title: "Code", "visible": true },
            { data: "rearning_default_amt", title: "Default Amount", "visible": true },
            { data: "rearning_percentage_tax", title: "Tax%", "visible": true },
            { data: "rearning_taxtotal", title: "Total", "visible": true },
            { data: "rearning_additional", title: "Additional", "visible": true },
            { data: "rearning_addtotal", title: "TaxTotal", "visible": true },
            { data: "total", title: "Total", "visible": true }
        ],

        "footerCallback": function (row, data, start, end, display) {
            var apie = this.api();

            // Remove the formatting to get integer data for summation
            var intVale = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            // Total over all pages
            window.totalearning = apie
                .column(6)
                .data()
                .reduce(function (a, b) {
                    return intVale(a) + intVale(b);
                }, 0);

            nTotalEarnings = window.totalearning;

            // Total over this page
            pageTotale = apie
                .column(6, { page: 'current' })
                .data()
                .reduce(function (a, b) {
                    return intVale(a) + intVale(b);
                }, 0);

            // Update footer
            $(apie.column(6).footer()).html(
                '₱' + window.totalearning + ''
            );
            $("#totalearning").html(window.totalearning);
        }

    });



    //deduction start
    $tblDeduction = $("#tblDeduction").DataTable({

        "responsive": true,
        "processing": true,
        "searching": false,
        "paging": false,
        "bInfo": false,

        columns: [

            { data: "rdeduction_code", title: "Code", "visible": true },
            { data: "rdeduction_default_amt", title: "Default Amount", "visible": true },
            { data: "rdeduction_percentage_tax", title: "Tax%", "visible": true },
            { data: "rdeduction_taxtotal", title: "Total", "visible": true },
            { data: "rdeduction_additional", title: "Additional", "visible": true },
            { data: "rdeduction_addtotal", title: "TaxTotal", "visible": true },
            { data: "total", title: "Total", "visible": true },

        ]
        ,

        "footerCallback": function (row, data, start, end, display) {
            var apid = this.api();

            // Remove the formatting to get integer data for summation
            var intVald = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            // Total over all pages
            window.totaldeduction = apid
                .column(6)
                .data()
                .reduce(function (a, b) {
                    return intVald(a) + intVald(b);
                }, 0);

            // Total over this page
            pageTotald = apid
                .column(6, { page: 'current' })
                .data()
                .reduce(function (a, b) {
                    return intVald(a) + intVald(b);
                }, 0);

            // Update footer
            $(apid.column(6).footer()).html(
                '₱' + window.totaldeduction + ''
            );
            $("#totaldeduction").html(window.totaldeduction);

        }
    });



    function loadGetDetailsAllowanceEarningsDeductions($id,$bioId) {
        $("#dtrPaySlip").val(0);
        $("#payroll-type").val(0);
        $url = "/page/payroll/generate-payroll/getDetailsAllowanceEarningsDeductions/*";
        var $xhr = $.ajax({
            type: 'POST',
            url: $url,
            data: { temp_id: $id },
            dataType: 'JSON',
            global: false,
            async: false,
            success: function ($result) {
                return $result;
            }
        }).responseText;

        //convert $xhr.responseText to JSON Object
        $data = JSON.parse($xhr);

        console.log($data);

        //see cgeneratepayroll.php method getDetailsAllowanceEarningsDeductions on how
        //this $xhr structured

    

        //get employee salary
        nBasicSalary = parseFloat($data[1]['employeeWork'][0]['rgradestep_salary']);

        //get all allowances and set the data to table
        $tblAllowance.clear().rows.add($data[2].allowances).draw();

        nTotalAllowance = 0;
        //sum all allowances
        for ($i = 0; $i < $data[2].allowances.length; $i++) {
            nTotalAllowance += parseFloat($data[2]['allowances'][$i]['total']);
        }

        //get all earnings and set it to the table
        $tblEarning.clear().rows.add($data[3].earnings).draw();

        //get total earnings
        nTotalEarnings = 0;
        for ($i = 0; $i < $data[3].earnings.length; $i++) {
            nTotalEarnings += parseFloat($data[3]['earnings'][$i]['total']);
        }

        //get all deductions and set it to the table
        $tblDeduction.clear().rows.add($data[4].deductions).draw();

        //get total deductions
        nTotalDeductions = 0;
        for ($i = 0; $i < $data[4].deductions.length; $i++) {
            nTotalDeductions += parseFloat($data[4]['deductions'][$i]['total']);
        }

        //get daily rate
        nDailyRate = (nBasicSalary / 22)  ;

        //rate per minute
        minuteRate = (nDailyRate / 8) /60;
        
        //get gross income
        nGrossIncome = nTotalEarnings + nTotalAllowance;
   
        //witholding tax
        if  (nBasicSalary <= 20833){
                witholdtax = 0;
            }
        else if(nBasicSalary >= 20833 && nBasicSalary <= 33332){
                taxrate = .2;
                taxable = nBasicSalary - 20833;
                witholdtax = taxable * taxrate;
            }
        else if(nBasicSalary >= 33333 && nBasicSalary <= 66666){
                minimumtax = 2500;
                taxrate = .25;
                taxable = nBasicSalary - 33333;
                witholdtax = (taxable * taxrate)+ minimumtax;
            }
        else if(nBasicSalary >= 66667 && nBasicSalary <= 166666){
                minimumtax = 10833.33;
                taxrate = .3;
                taxable = nBasicSalary - 66667;
                witholdtax = (taxable * taxrate)+ minimumtax;
            }
        else if(nBasicSalary >= 166667 && nBasicSalary <= 666666){
                minimumtax = 40833.33;
                taxrate = .32;
                taxable = nBasicSalary - 166667;
                witholdtax = (taxable * taxrate)+ minimumtax;
            }
        else if(nBasicSalary > 666667 ){
                minimumtax = 200833.33;
                taxrate = .35;
                taxable = nBasicSalary - 666667;
                witholdtax = (taxable * taxrate)+ minimumtax;
            }


        // $("#payroll-type").selectedIndex = 0;
         //display values
        $("#dailyrate").html('₱' + parseFloat(nDailyRate.toFixed(2)));
        $("#minuterate").html('₱' + parseFloat(minuteRate.toFixed(2)));
       
        $("#grossincome").html('₱' + parseFloat(nGrossIncome.toFixed(2)));
        $("#taxableincome").html('₱' + parseFloat(0).toFixed(2));
        
        $("#totalallowance").html('₱' + parseFloat(nTotalAllowance).toFixed(2));
        $("#totalearning").html('₱' + parseFloat(nTotalEarnings).toFixed(2));
        $("#totaldeduction").html('₱' + parseFloat(nTotalDeductions).toFixed(2));
        
        $("#basicsalary").html('₱' + parseFloat(0).toFixed(2));
        $("#witholdingtax").html('₱' + parseFloat(0).toFixed(2));
        $("#netpay").html('₱' + parseFloat(0).toFixed(2));
        return false;
    }


    $("#payroll-type").on('change', function (e) {
        e.preventDefault();
        var $PayDate = $("#dtrPaySlip").val();
        $yx = $PayDate.split('/');
        let $year = $yx[0];
        let $month = $yx[1];

        if ($PayDate == 0){
            alert("Please Select Date");
        }

        // $("#dtrPaySlip").on("change",function(){
        //     $("#payroll-type").val(0);
        // });
        
        switch ($("#payroll-type").val()) {
            case 'semi-monthly':
            
                $url = "/page/payroll/generate-payroll/getDtrKinsenas/*";
                $.ajax($url, {
                  type: 'POST',
                  dataType: 'JSON',
                  cache: false,
                  data: { 
                    bioid: wBioId , yearKin: $year , monthKin: $month },
                }).then(function ($data) {

                    $count = $data.WorkHours.length;
                   if($count == 0){
                    Swal.fire(
                        'Empty!',
                        'No Data Available!',
                        'warning'
                      );
                      return false;
                   }
                    for($x=0;$x<$count;$x++){
                        if($data.WorkHours[$x].calc_d1 == null || $data.WorkHours[$x].calc_d2 == null ||
                           $data.WorkHours[$x].calc_d3 == null ||  $data.WorkHours[$x].calc_d4 == null ||
                           $data.WorkHours[$x].calc_d5 == null ||  $data.WorkHours[$x].calc_d6 == null ||
                           $data.WorkHours[$x].calc_d7 == null ||  $data.WorkHours[$x].calc_d8 == null ||
                           $data.WorkHours[$x].calc_d9 == null ||  $data.WorkHours[$x].calc_d10 == null ||
                           $data.WorkHours[$x].calc_d11 == null ||  $data.WorkHours[$x].calc_d12 == null ||
                           $data.WorkHours[$x].calc_d13 == null ||  $data.WorkHours[$x].calc_d14 == null ||
                           $data.WorkHours[$x].calc_d15 == null ){
                            
                            Swal.fire(
                                'Not Confirmed!!!',
                                'Time entries not confirmed!!!!',
                                'warning'
                              );
                        }
                       
                       //day 1
                       $d1 =  $data.WorkHours[$x].calc_d1;
                       $h1 =  $d1.split(' ');
                       $d1Time =  $h1[0];
                       $time1 = $d1Time.split(':');
                       $hour1 = $time1[0];
                       $min1 = $time1[1];
                       if($hour1 > 8){
                        $hour1 = 08;
                        $min1  = 00;
                       }

                       //day 2
                       $d2 =  $data.WorkHours[$x].calc_d2;
                       $h2 =  $d2.split(' ');
                       $d2Time =  $h2[0];
                       $time2 = $d2Time.split(':');
                       $hour2 = $time2[0];
                       $min2 = $time2[1];
                       if($hour2 > 8){
                        $hour2 = 08;
                        $min2  = 00;
                       }

                       //day 3
                       $d3 =  $data.WorkHours[$x].calc_d3;
                       $h3 =  $d3.split(' ');
                       $d3Time =  $h3[0];
                       $time3 = $d3Time.split(':');
                       $hour3 = $time3[0];
                       $min3 = $time3[1];
                       if($hour3 > 8){
                        $hour3 = 08;
                        $min3  = 00;
                       }

                       //day 4
                       $d4 =  $data.WorkHours[$x].calc_d4;
                       $h4 =  $d4.split(' ');
                       $d4Time =  $h4[0];
                       $time4 = $d4Time.split(':');
                       $hour4 = $time4[0];
                       $min4 = $time4[1];
                       if($hour4 > 8){
                        $hour4 = 08;
                        $min4  = 00;
                       }

                       //day 5
                       $d5 =  $data.WorkHours[$x].calc_d5;
                       $h5 =  $d5.split(' ');
                       $d5Time =  $h5[0];
                       $time5 = $d5Time.split(':');
                       $hour5 = $time5[0];
                       $min5 = $time5[1];
                       if($hour5 > 8){
                        $hour5 = 08;
                        $min5  = 00;
                       }

                       //day 6
                       $d6 =  $data.WorkHours[$x].calc_d6;
                       $h6 =  $d6.split(' ');
                       $d6Time =  $h6[0];
                       $time6 = $d6Time.split(':');
                       $hour6 = $time6[0];
                       $min6 = $time6[1];
                       if($hour6 > 8){
                        $hour6 = 08;
                        $min6  = 00;
                       }

                    //day 7
                    $d7 =  $data.WorkHours[$x].calc_d7;
                    $h7 =  $d7.split(' ');
                    $d7Time =  $h7[0];
                    $time7 = $d7Time.split(':');
                    $hour7 = $time7[0];
                    $min7 = $time7[1];
                    if($hour7 > 8){
                        $hour7 = 08;
                        $min7  = 00;
                       }

                    //day 8
                    $d8 =  $data.WorkHours[$x].calc_d8;
                    $h8 =  $d8.split(' ');
                    $d8Time =  $h8[0];
                    $time8 = $d8Time.split(':');
                    $hour8 = $time8[0];
                    $min8 = $time8[1];
                    if($hour8 > 8){
                        $hour8 = 08;
                        $min8  = 00;
                       }

                    //day 9
                    $d9 =  $data.WorkHours[$x].calc_d9;
                    $h9 =  $d9.split(' ');
                    $d9Time =  $h9[0];
                    $time9 = $d9Time.split(':');
                    $hour9 = $time9[0];
                    $min9 = $time9[1];
                    if($hour9 > 8){
                        $hour9 = 08;
                        $min9  = 00;
                       }

                    //day 10
                    $d10 =  $data.WorkHours[$x].calc_d10;
                    $h10 =  $d10.split(' ');
                    $d10Time =  $h10[0];
                    $time10 = $d10Time.split(':');
                    $hour10 = $time10[0];
                    $min10 = $time10[1];
                    if($hour10 > 8){
                        $hour10 = 08;
                        $min10  = 00;
                       }

                    //day 11
                    $d11 =  $data.WorkHours[$x].calc_d11;
                    $h11 =  $d11.split(' ');
                    $d11Time =  $h11[0];
                    $time11 = $d11Time.split(':');
                    $hour11 = $time11[0];
                    $min11 = $time11[1];
                    if($hour11 > 8){
                        $hour11 = 08;
                        $min11  = 00;
                       }

                    //day 12
                    $d12 =  $data.WorkHours[$x].calc_d12;
                    $h12 =  $d12.split(' ');
                    $d12Time =  $h12[0];
                    $time12 = $d12Time.split(':');
                    $hour12 = $time12[0];
                    $min12 = $time12[1];
                    if($hour12 > 8){
                        $hour12 = 08;
                        $min12  = 00;
                       }

                    //day 13
                    $d13 =  $data.WorkHours[$x].calc_d13;
                    $h13 =  $d13.split(' ');
                    $d13Time =  $h13[0];
                    $time13 = $d13Time.split(':');
                    $hour13 = $time13[0];
                    $min13 = $time13[1];
                    if($hour13 > 8){
                        $hour13 = 08;
                        $min13  = 00;
                       }

                    //day 14
                    $d14 =  $data.WorkHours[$x].calc_d14;
                    $h14 =  $d14.split(' ');
                    $d14Time =  $h14[0];
                    $time14 = $d14Time.split(':');
                    $hour14 = $time14[0];
                    $min14 = $time14[1];
                    if($hour14 > 8){
                        $hour14 = 08;
                        $min14  = 00;
                       }

                    //day 15
                    $d15 =  $data.WorkHours[$x].calc_d15;
                    $h15 =  $d15.split(' ');
                    $d15Time =  $h15[0];
                    $time15 = $d15Time.split(':');
                    $hour15 = $time15[0];
                    $min15 = $time15[1];
                    if($hour15 > 8){
                        $hour15 = 08;
                        $min15  = 00;
                       }

                       $leave_credits = $data.WorkHours[$x].leave_credits;
                       
                    }

                    var TotalHourKin = parseInt($hour1) + parseInt($hour2) + parseInt($hour3)
                                      +parseInt($hour4) + parseInt($hour5) +parseInt($hour6)
                                      +parseInt($hour7) + parseInt($hour8) + parseInt($hour9) 
                                      +parseInt($hour10) + parseInt($hour11) + parseInt($hour12)
                                      +parseInt($hour13) + parseInt($hour14) + parseInt($hour15); 
                    var TotalMinKin = parseInt($min1) + parseInt($min2) + parseInt($min3)
                                     +parseInt($min4) + parseInt($min5) + parseInt($min6)
                                     +parseInt($min7) + parseInt($min8) + parseInt($min9)
                                     +parseInt($min10) + parseInt($min11) + parseInt($min12)
                                     +parseInt($min13) + parseInt($min14) + parseInt($min15); 

                       if(TotalMinKin > 59){
                        var min = TotalMinKin;
                        var hr = Math.floor(min / 60);
                        var hrTemp = Math.floor(Math.abs(TotalHourKin));
                        var remMin = min % 60;
                        TotalHourKin = hr + hrTemp;
                        TotalMinKin = remMin;
                     }

                     if(TotalHourKin > 88){
                        TotalHourKin = 88;
                        TotalMinKin = 00;
                     }

                    //  alert(TotalHourKin *60 + parseInt(TotalMinKin));
                     

                     var kinHour = 88+':'+00;
                     let Tstart = moment.duration(kinHour, "HH:mm");
                     let TEnd = moment.duration( TotalHourKin +':'+TotalMinKin, "HH:mm");
                     let KinTotal = TEnd.subtract(Tstart);
                
                     let KinTotalHour = KinTotal.hours();
                     let KinTotalMin  = KinTotal.minutes();

                     if($empType == "Permanent"){
                      $LcHOur = parseInt(Math.abs(TotalHourKin)) +parseInt(Math.abs(KinTotalHour));
                      $LcMin = parseInt(Math.abs(TotalMinKin)) +parseInt(Math.abs(KinTotalMin));
                  
                        if($LcMin > 59){
                            var minlc = $LcMin;
                            var hrlc = Math.floor(minlc / 60);
                            var hrTemplc = Math.floor(Math.abs($LcHOur));
                            var remMinlc = minlc % 60;
                            TotalHourKin = hrlc + hrTemplc;
                            TotalMinKin = remMinlc;
                        }
                        KinTotalHour = 0;
                        KinTotalMin = 0;
                        $("#leave_credits").html($leave_credits);
                     
                    }
                    var TotalWorkingHoursKinsenas = TotalHourKin * 60 + parseInt(TotalMinKin);
                    
                    var kinSalary = minuteRate * TotalWorkingHoursKinsenas;
                     
                     $("#totalworkhours").html(TotalHourKin +' '+ "Hours" +' '+"And"+' '+TotalMinKin+' '+ "Minutes");
                     $("#Undertime").html(Math.abs(KinTotalHour) +' '+ "Hours" +' '+"And"+' '+Math.abs(KinTotalMin)+' '+ "Minutes");
                     
                     $("#grossincome").html('₱' + parseFloat(nGrossIncome.toFixed(2)));
                    $("#basicsalary").html('₱' + parseFloat(nBasicSalary/2).toFixed(2));
                    $("#witholdingtax").html('₱' + parseFloat(witholdtax/2).toFixed(2));
                      nTotalNetPay =parseInt(kinSalary) +((nGrossIncome/2) - (nTotalDeductions/2) -( witholdtax/2));
                    $("#netpay").html('₱' + parseFloat(nTotalNetPay.toFixed(2)));

                Swal.fire(
                    '<p class="text-primary">Total Net Pay</p>'+'-'+'₱' + parseFloat(nTotalNetPay.toFixed(2)),
                    '<p class="text-success">Hours Work</p>'+' '+TotalHourKin +' '+ "Hours" +' '+"And"+' '+TotalMinKin+' '+ "Minutes",
                    'success'
                  );
                 
                });
                
            break;
            case 'monthly':
                $url = "/page/payroll/generate-payroll/getDtrKatapusan/*";
                $.ajax($url, {
                  type: 'POST',
                  dataType: 'JSON',
                  data: { 
                    bioid: wBioId , yearKat: $year , monthKat: $month },
                }).then(function ($data) {

                    $count = $data.WorkHours.length;
                    if($count == 0){
                        Swal.fire(
                            'Empty!',
                            'No Data Available!',
                            'warning'
                          );
                          return false;
                       }
                    for($x=0;$x<$count;$x++){
                        if($data.WorkHours[$x].calc_d16 == null || $data.WorkHours[$x].calc_d17 == null ||
                            $data.WorkHours[$x].calc_d18 == null ||  $data.WorkHours[$x].calc_d19 == null ||
                            $data.WorkHours[$x].calc_d20 == null ||  $data.WorkHours[$x].calc_d21 == null ||
                            $data.WorkHours[$x].calc_d22 == null ||  $data.WorkHours[$x].calc_d23 == null ||
                            $data.WorkHours[$x].calc_d24 == null ||  $data.WorkHours[$x].calc_d25 == null ||
                            $data.WorkHours[$x].calc_d26 == null ||  $data.WorkHours[$x].calc_d27 == null ||
                            $data.WorkHours[$x].calc_d28 == null ||  $data.WorkHours[$x].calc_d29 == null ||
                            $data.WorkHours[$x].calc_d30 == null || $data.WorkHours[$x].calc_d31 == null ){
                            
                            Swal.fire(
                                'Not Confirmed!!!',
                                'Time entries not confirmed!!!!',
                                'warning'
                              );
                         }
                        //day 16
                        $d16 =  $data.WorkHours[$x].calc_d16;
                        $h16 =  $d16.split(' ');
                        $d16Time =  $h16[0];
                        $time16 = $d16Time.split(':');
                        $hour16 = $time16[0];
                        $min16 = $time16[1];
                        if($hour16 > 8){
                            $hour16 = 08;
                            $min16  = 00;
                            }

                            //day 17
                        $d17 =  $data.WorkHours[$x].calc_d17;
                        $h17 =  $d17.split(' ');
                        $d17Time =  $h17[0];
                        $time17 = $d17Time.split(':');
                        $hour17 = $time17[0];
                        $min17 = $time17[1];
                        if($hour17 > 8){
                            $hour17 = 08;
                            $min17  = 00;
                            }    

                            //day 18
                        $d18 =  $data.WorkHours[$x].calc_d18;
                        $h18 =  $d18.split(' ');
                        $d18Time =  $h18[0];
                        $time18 = $d18Time.split(':');
                        $hour18 = $time18[0];
                        $min18 = $time18[1];
                        if($hour18 > 8){
                            $hour18 = 08;
                            $min18  = 00;
                            }    

                            //day 19
                        $d19 =  $data.WorkHours[$x].calc_d19;
                        $h19 =  $d19.split(' ');
                        $d19Time =  $h19[0];
                        $time19 = $d19Time.split(':');
                        $hour19 = $time19[0];
                        $min19 = $time19[1];
                        if($hour19 > 8){
                            $hour19 = 08;
                            $min19  = 00;
                            }    

                            //day 20
                        $d20 =  $data.WorkHours[$x].calc_d20;
                        $h20 =  $d20.split(' ');
                        $d20Time =  $h20[0];
                        $time20 = $d20Time.split(':');
                        $hour20 = $time20[0];
                        $min20 = $time20[1];
                        if($hour20 > 8){
                            $hour20 = 08;
                            $min20  = 00;
                            }    

                            //day 21
                        $d21 =  $data.WorkHours[$x].calc_d21;
                        $h21 =  $d21.split(' ');
                        $d21Time =  $h21[0];
                        $time21 = $d21Time.split(':');
                        $hour21 = $time21[0];
                        $min21 = $time21[1];
                        if($hour21 > 8){
                            $hour21 = 08;
                            $min21  = 00;
                            }    

                            //day 22
                        $d22 =  $data.WorkHours[$x].calc_d22;
                        $h22 =  $d22.split(' ');
                        $d22Time =  $h22[0];
                        $time22 = $d22Time.split(':');
                        $hour22 = $time22[0];
                        $min22 = $time22[1];
                        if($hour22 > 8){
                            $hour22 = 08;
                            $min22  = 00;
                            }    


                            //day 23
                        $d23 =  $data.WorkHours[$x].calc_d23;
                        $h23 =  $d23.split(' ');
                        $d23Time =  $h23[0];
                        $time23 = $d23Time.split(':');
                        $hour23 = $time23[0];
                        $min23 = $time23[1];
                        if($hour23 > 8){
                            $hour23 = 08;
                            $min23  = 00;
                            }    

                            //day 24
                        $d24 =  $data.WorkHours[$x].calc_d24;
                        $h24 =  $d24.split(' ');
                        $d24Time =  $h24[0];
                        $time24 = $d24Time.split(':');
                        $hour24 = $time24[0];
                        $min24 = $time24[1];
                        if($hour24 > 8){
                            $hour24 = 08;
                            $min24  = 00;
                            }    


                            //day 25
                        $d25 =  $data.WorkHours[$x].calc_d25;
                        $h25 =  $d25.split(' ');
                        $d25Time =  $h25[0];
                        $time25 = $d25Time.split(':');
                        $hour25 = $time25[0];
                        $min25 = $time25[1];
                        if($hour25 > 8){
                            $hour25 = 08;
                            $min25  = 00;
                            }    


                            //day 26
                        $d26 =  $data.WorkHours[$x].calc_d26;
                        $h26 =  $d26.split(' ');
                        $d26Time =  $h26[0];
                        $time26 = $d26Time.split(':');
                        $hour26 = $time26[0];
                        $min26 = $time26[1];
                        if($hour26 > 8){
                            $hour26 = 08;
                            $min26  = 00;
                            }  
                            
                            
                            //day 27
                        $d27 =  $data.WorkHours[$x].calc_d27;
                        $h27 =  $d27.split(' ');
                        $d27Time =  $h27[0];
                        $time27 = $d27Time.split(':');
                        $hour27 = $time27[0];
                        $min27 = $time27[1];
                        if($hour27 > 8){
                            $hour27 = 08;
                            $min27  = 00;
                            }    


                            //day 28
                        $d28 =  $data.WorkHours[$x].calc_d28;
                        $h28 =  $d28.split(' ');
                        $d28Time =  $h28[0];
                        $time28 = $d28Time.split(':');
                        $hour28 = $time28[0];
                        $min28 = $time28[1];
                        if($hour28 > 8){
                            $hour28 = 08;
                            $min28  = 00;
                            }    


                            //day 29
                        $d29 =  $data.WorkHours[$x].calc_d29;
                        $h29 =  $d29.split(' ');
                        $d29Time =  $h29[0];
                        $time29 = $d29Time.split(':');
                        $hour29 = $time29[0];
                        $min29 = $time29[1];
                        if($hour29 > 8){
                            $hour29 = 08;
                            $min29  = 00;
                            }    


                            //day 30
                        $d30 =  $data.WorkHours[$x].calc_d30;
                        $h30 =  $d30.split(' ');
                        $d30Time =  $h30[0];
                        $time30 = $d30Time.split(':');
                        $hour30 = $time30[0];
                        $min30 = $time30[1];
                        if($hour30 > 8){
                            $hour30 = 08;
                            $min30  = 00;
                            }    


                            //day 31
                        $d31 =  $data.WorkHours[$x].calc_d31;
                        $h31 =  $d31.split(' ');
                        $d31Time =  $h31[0];
                        $time31 = $d31Time.split(':');
                        $hour31 = $time31[0];
                        $min31 = $time31[1];
                        if($hour31 > 8){
                            $hour31 = 08;
                            $min31  = 00;
                            } 
                     }
                    

                    var TotalHourKat = parseInt($hour16) + parseInt($hour17) + parseInt($hour18)
                                      +parseInt($hour19) + parseInt($hour20) +parseInt($hour21)
                                      +parseInt($hour22) + parseInt($hour23) + parseInt($hour24) 
                                      +parseInt($hour25) + parseInt($hour26) + parseInt($hour27)
                                      +parseInt($hour28) + parseInt($hour29) + parseInt($hour30)
                                      +parseInt($hour31); 
                    var TotalMinKat = parseInt($min16) + parseInt($min17) + parseInt($min18)
                                     +parseInt($min19) + parseInt($min20) + parseInt($min21)
                                     +parseInt($min22) + parseInt($min23) + parseInt($min24)
                                     +parseInt($min25) + parseInt($min26) + parseInt($min27)
                                     +parseInt($min28) + parseInt($min29) + parseInt($min30)
                                     +parseInt($min31); 

                       if(TotalMinKat > 59){
                        var minT = TotalMinKat;
                        var hrT = Math.floor(minT / 60);
                        var hrTempT = Math.floor(Math.abs(TotalHourKat));
                        var remMinT = minT % 60;
                        TotalHourKat = hrT + hrTempT;
                        TotalMinKat = remMinT;
                     }

                     if(TotalHourKat > 88){
                        TotalHourKat = 88;
                        TotalMinKat = 00;
                     }
                    //  alert(TotalHourKat *60 + parseInt(TotalMinKat));
                     
                  
                     var katnHour = 88+':'+00;
                     let Tkatstart = moment.duration(katnHour, "HH:mm");
                     let TkatEnd = moment.duration( TotalHourKat +':'+TotalMinKat, "HH:mm");
                     let KatTotal = TkatEnd.subtract(Tkatstart);
                
                     let KatTotalHour = KatTotal.hours();
                     let KatTotalMin  = KatTotal.minutes();


                     if($empType == "Permanent"){
                        $LcHOur = parseInt(Math.abs(TotalHourKat)) +parseInt(Math.abs(KatTotalHour));
                        $LcMin = parseInt(Math.abs(TotalMinKat)) +parseInt(Math.abs(KatTotalMin));
                    
                          if($LcMin > 59){
                              var minlc = $LcMin;
                              var hrlc = Math.floor(minlc / 60);
                              var hrTemplc = Math.floor(Math.abs($LcHOur));
                              var remMinlc = minlc % 60;
                              TotalHourKat = hrlc + hrTemplc;
                              TotalMinKat = remMinlc;
                          }
                          KatTotalHour = 0;
                          KatTotalMin = 0;
                          $("#leave_credits").html($leave_credits);
                      }

                      var TotalWorkingHoursKatapusan = TotalHourKat * 60 + parseInt(TotalMinKat);
                    
                     var katSalary = minuteRate * TotalWorkingHoursKatapusan;

                     
                     $("#Undertime").html(Math.abs(KatTotalHour) +' '+ "Hours" +' '+"And"+' '+Math.abs(KatTotalMin)+' '+ "Minutes");
                     $("#totalworkhours").html(TotalHourKat +' '+ "Hours" +' '+"And"+' '+TotalMinKat+' '+ "Minutes");
                     $("#basicsalary").html('₱' + parseFloat(nBasicSalary/2).toFixed(2));
                     $("#witholdingtax").html('₱' + parseFloat(witholdtax/2).toFixed(2));
                     nTotalNetPay = parseInt(katSalary)+((nGrossIncome/2) - (nTotalDeductions/2) -( witholdtax/2));
                     $("#netpay").html('₱' + parseFloat(nTotalNetPay.toFixed(2)));

                     Swal.fire(
                        '<p class="text-primary">Total Net Pay</p>'+'-'+'₱' + parseFloat(nTotalNetPay.toFixed(2)),
                        '<p class="text-success">Hours Work</p>'+' '+TotalHourKat +' '+ "Hours" +' '+"And"+' '+TotalMinKat+' '+ "Minutes",
                        'success'
                      );
                   
                });
               
            break;
            case '0':
                $("#basicsalary").html('₱' + parseFloat(0).toFixed(2));
                $("#witholdingtax").html('₱' + parseFloat(0).toFixed(2));
                $("#netpay").html('₱' + parseFloat(0).toFixed(2));
            break;
            
        }
        
        return false;
        
    });

 $("#btnPrint").on('click', function (e) {
     if ($("#payroll-type").val()==0){
        alert('please select payrol type');
     }else{
        $("#print-area").print();
     }
        
    });

    $('#tblGeneratePayroll tbody').on('click', '.btnDtr', function (e) {
        e.preventDefault();
        $urldtr= 'dsd';
        // $('#dtrDate').children('option').text('New Text');
        $id = $(this).data();

        var $dataRow = $tblGeneratePayroll.row(this).data();
        if ($dataRow === undefined) {
            $dataRow = $tblGeneratePayroll.row($(this).parents('tr')).data();
        }
       $EmpName = $dataRow.Name
        $(".Name").html($EmpName);

        $("#modalDtrTitle").html("DTR");
        $("#btnDtrPrint").html("Print");
        $modalDtr.modal('show');

        $("#dtrDate").val("0");

        
        ClearDtrValue();
       return;
    });

    $("#dtrDate").on('change',function(e){
        e.preventDefault();
        
       $date =  this.value;
       $x = $date.split('/');
       $year = $x[0];
       $month = $x[1];

       if($date == 0 ){
        ClearDtrValue();
        return false;
       }
       $("#dtrDate2").val($date);
        $urldtr = "/page/payroll/generate-payroll/getEmpDtr/*";
        $.ajax($urldtr, {
          type: 'POST',
          dataType: 'JSON',
          cache: false,
          data: { year: $year,
                  month: $month,
                  biid: $id },
         }).then(function ($data) {
            $w = $data.empDtr[0].maybee;
            $x = $data.empDtr.length;
           
               if($w === "maybe") {
                ClearDtrValue();
                Swal.fire(
                    'Empty!',
                    'No Data Available!',
                    'warning'
                  );
                  return false;
               }
                Swal.fire(
                    '<p class="text-primary">DTR of</p>' +' - '+$EmpName,
                    '<p class="text-success">For the month of</p> '+'  '+ $date,
                    'success'
                  );
               
             
            for(var $i=0;$i<$x;$i++){
                if($data.empDtr[$i].confirmedd1 != 1 || $data.empDtr[$i].confirmedd2 != 1 || $data.empDtr[$i].confirmedd3 != 1
                   ||$data.empDtr[$i].confirmedd4 != 1 || $data.empDtr[$i].confirmedd5 != 1 || $data.empDtr[$i].confirmedd6 != 1
                   ||$data.empDtr[$i].confirmedd7 != 1 || $data.empDtr[$i].confirmedd8 != 1 || $data.empDtr[$i].confirmedd9 != 1 
                   ||$data.empDtr[$i].confirmedd10 != 1 || $data.empDtr[$i].confirmedd11 != 1 || $data.empDtr[$i].confirmedd12 != 1
                   ||$data.empDtr[$i].confirmedd13 != 1 || $data.empDtr[$i].confirmedd14 != 1 || $data.empDtr[$i].confirmedd15 != 1
                   ||$data.empDtr[$i].confirmedd16 != 1 || $data.empDtr[$i].confirmedd17 != 1 || $data.empDtr[$i].confirmedd18 != 1
                   ||$data.empDtr[$i].confirmedd19 != 1 || $data.empDtr[$i].confirmedd20 != 1 || $data.empDtr[$i].confirmedd21 != 1
                   ||$data.empDtr[$i].confirmedd22 != 1 || $data.empDtr[$i].confirmedd23 != 1 || $data.empDtr[$i].confirmedd24 != 1
                   ||$data.empDtr[$i].confirmedd25 != 1 || $data.empDtr[$i].confirmedd26 != 1 || $data.empDtr[$i].confirmedd27 != 1
                   ||$data.empDtr[$i].confirmedd28 != 1 || $data.empDtr[$i].confirmedd29 != 1 || $data.empDtr[$i].confirmedd30 != 1
                   || $data.empDtr[$i].confirmedd31 != 1){
                    ClearDtrValue();
                    Swal.fire(
                        'Not Confirmed!!!',
                        'Time entries not confirmed!!!!',
                        'warning'
                      );
                    return false;
                }
                let TWH1 = $data.empDtr[$i].cHWtime1
                let TWH2 = $data.empDtr[$i].cHWtime2;
                let TWH3 = $data.empDtr[$i].cHWtime3;
                let TWH4 = $data.empDtr[$i].cHWtime4;
                let TWH5 = $data.empDtr[$i].cHWtime5;
                let TWH6 = $data.empDtr[$i].cHWtime6;
                let TWH7 = $data.empDtr[$i].cHWtime7;
                let TWH8 = $data.empDtr[$i].cHWtime8;
                let TWH9 = $data.empDtr[$i].cHWtime9;
                let TWH10 = $data.empDtr[$i].cHWtime10;
                let TWH11 = $data.empDtr[$i].cHWtime11;
                let TWH12 = $data.empDtr[$i].cHWtime12;
                let TWH13 = $data.empDtr[$i].cHWtime13;
                let TWH14 = $data.empDtr[$i].cHWtime14;
                let TWH15 = $data.empDtr[$i].cHWtime15;
                let TWH16 = $data.empDtr[$i].cHWtime16;
                let TWH17 = $data.empDtr[$i].cHWtime17;
                let TWH18 = $data.empDtr[$i].cHWtime18;
                let TWH19 = $data.empDtr[$i].cHWtime19;
                let TWH20 = $data.empDtr[$i].cHWtime20;
                let TWH21 = $data.empDtr[$i].cHWtime21;
                let TWH22 = $data.empDtr[$i].cHWtime22;
                let TWH23 = $data.empDtr[$i].cHWtime23;
                let TWH24 = $data.empDtr[$i].cHWtime24;
                let TWH25 = $data.empDtr[$i].cHWtime25;
                let TWH26 = $data.empDtr[$i].cHWtime26;
                let TWH27 = $data.empDtr[$i].cHWtime27;
                let TWH28 = $data.empDtr[$i].cHWtime28;
                let TWH29 = $data.empDtr[$i].cHWtime29; 
                let TWH30 = $data.empDtr[$i].cHWtime30;
                let TWH31 = $data.empDtr[$i].cHWtime31;

                let TMH1 = $data.empDtr[$i].cMWtime1;
                let TMH2 = $data.empDtr[$i].cMWtime2;
                let TMH3 = $data.empDtr[$i].cMWtime3;
                let TMH4 = $data.empDtr[$i].cMWtime4;
                let TMH5 = $data.empDtr[$i].cMWtime5;
                let TMH6 = $data.empDtr[$i].cMWtime6;
                let TMH7 = $data.empDtr[$i].cMWtime7;
                let TMH8 = $data.empDtr[$i].cMWtime8;
                let TMH9 = $data.empDtr[$i].cMWtime9;
                let TMH10 = $data.empDtr[$i].cMWtime10;
                let TMH11 = $data.empDtr[$i].cMWtime11;
                let TMH12 = $data.empDtr[$i].cMWtime12;
                let TMH13 = $data.empDtr[$i].cMWtime13;
                let TMH14 = $data.empDtr[$i].cMWtime14;
                let TMH15 = $data.empDtr[$i].cMWtime15;
                let TMH16 = $data.empDtr[$i].cMWtime16;
                let TMH17 = $data.empDtr[$i].cMWtime17;
                let TMH18 = $data.empDtr[$i].cMWtime18;
                let TMH19 = $data.empDtr[$i].cMWtime19;
                let TMH20 = $data.empDtr[$i].cMWtime20;
                let TMH21 = $data.empDtr[$i].cMWtime21;
                let TMH22 = $data.empDtr[$i].cMWtime22;
                let TMH23 = $data.empDtr[$i].cMWtime23;
                let TMH24 = $data.empDtr[$i].cMWtime24;
                let TMH25 = $data.empDtr[$i].cMWtime25;
                let TMH26 = $data.empDtr[$i].cMWtime26;
                let TMH27 = $data.empDtr[$i].cMWtime27;
                let TMH28 = $data.empDtr[$i].cMWtime28;
                let TMH29 = $data.empDtr[$i].cMWtime29; 
                let TMH30 = $data.empDtr[$i].cMWtime30;
                let TMH31 = $data.empDtr[$i].cMWtime31;

                if(TWH1 > 8){
                    TWH1 = 8;
                    TMH1 = 0;
                }
                if(TWH2 > 8){
                    TWH2 = 8;
                    TMH2 = 0;
                }
                if(TWH3 > 8){
                    TWH3 = 8;
                    TMH3 = 0;
                }
                if(TWH4 > 8){
                    TWH4 = 8;
                    TMH4 = 0;
                }
                if(TWH5 > 8){
                    TWH5 = 8;
                    TMH5 = 0;
                }
                if(TWH6 > 8){
                    TWH6 = 8;
                    TMH6 = 0;
                }
                if(TWH7 > 8){
                    TWH7 = 8;
                    TMH7 = 0;
                }
                if(TWH8 > 8){
                    TWH8 = 8;
                    TMH8 = 0;
                }
                if(TWH9 > 8){
                    TWH9 = 8;
                    TMH9 = 0;
                }
                if(TWH10 > 8){
                    TWH10 = 8;
                    TMH10 = 0;
                }
                if(TWH11 > 8){
                    TWH11 = 8;
                    TMH11 = 0;
                }
                if(TWH12 > 8){
                    TWH12 = 8;
                    TMH12 = 0;
                }
                if(TWH13 > 8){
                    TWH13 = 8;
                    TMH13 = 0;
                }
                if(TWH14 > 8){
                    TWH14 = 8;
                    TMH14 = 0;
                }
                if(TWH15 > 8){
                    TWH15 = 8;
                    TMH15 = 0;
                }
                if(TWH16 > 8){
                    TWH16 = 8;
                    TMH16 = 0;
                }
                if(TWH17 > 8){
                    TWH17 = 8;
                    TMH17 = 0;
                }
                if(TWH18 > 8){
                    TWH18 = 8;
                    TMH18 = 0;
                }
                if(TWH19 > 8){
                    TWH19 = 8;
                    TMH19 = 0;
                }
                if(TWH20 > 8){
                    TWH20 = 8;
                    TMH20 = 0;
                }
                if(TWH21 > 8){
                    TWH21 = 8;
                    TMH21 = 0;
                }
                if(TWH22 > 8){
                    TWH22 = 8;
                    TMH22 = 0;
                }
                if(TWH23 > 8){
                    TWH23 = 8;
                    TMH23 = 0;
                }
                if(TWH24 > 8){
                    TWH24 = 8;
                    TMH24 = 0;
                }
                if(TWH25 > 8){
                    TWH25 = 8;
                    TMH25 = 0;
                }
                if(TWH26 > 8){
                    TWH26 = 8;
                    TMH26 = 0;
                }
                if(TWH27 > 8){
                    TWH27 = 8;
                    TMH27 = 0;
                }
                if(TWH28 > 8){
                    TWH28 = 8;
                    TMH28 = 0;
                }
                if(TWH29 > 8){
                    TWH29 = 8;
                    TMH29 = 0;
                }
                if(TWH30 > 8){
                    TWH30 = 8;
                    TMH30 = 0;
                }
                if(TWH31 > 8){
                    TWH31 = 8;
                    TMH31 = 0;
                }

                var TotalH = parseInt(TWH1) + parseInt(TWH2) + parseInt(TWH3)+
                             parseInt(TWH4) + parseInt(TWH5) + parseInt(TWH6)+
                             parseInt(TWH7) + parseInt(TWH8) + parseInt(TWH9)+
                             parseInt(TWH10) + parseInt(TWH11) + parseInt(TWH12)+
                             parseInt(TWH13) + parseInt(TWH14) + parseInt(TWH15)+
                             parseInt(TWH16) + parseInt(TWH17) + parseInt(TWH18)+
                             parseInt(TWH19) + parseInt(TWH20) + parseInt(TWH21)+
                             parseInt(TWH22) + parseInt(TWH23) + parseInt(TWH24)+
                             parseInt(TWH25) + parseInt(TWH26) + parseInt(TWH27)+
                             parseInt(TWH28) + parseInt(TWH29) + parseInt(TWH30)+
                             parseInt(TWH31);

                var TotalM = parseInt(TMH1) + parseInt(TMH2) + parseInt(TMH3)+
                             parseInt(TMH4) + parseInt(TMH5) + parseInt(TMH6)+
                             parseInt(TMH7) + parseInt(TMH8) + parseInt(TMH9)+
                             parseInt(TMH10) + parseInt(TMH11) + parseInt(TMH12)+
                             parseInt(TMH13) + parseInt(TMH14) + parseInt(TMH15)+
                             parseInt(TMH16) + parseInt(TMH17) + parseInt(TMH18)+
                             parseInt(TMH19) + parseInt(TMH20) + parseInt(TMH21)+
                             parseInt(TMH22) + parseInt(TMH23) + parseInt(TMH24)+
                             parseInt(TMH25) + parseInt(TMH26) + parseInt(TMH27)+
                             parseInt(TMH28) + parseInt(TMH29) + parseInt(TMH30)+
                             parseInt(TMH31);

                             if(TotalM > 59){
                                var min = TotalM;
                                var hr = Math.floor(min / 60);
                                var hrTemp = Math.floor(Math.abs(TotalH));
                                var remMin = min % 60;
                                TotalH = hr + hrTemp;
                                TotalM = remMin;
                             }
                            //  alert(TotalH+':'+TotalM);
                            $(".TotalM").html('<span>Total - </span>'+' '+TotalH+' '+'Hrs.'+' '+'and'+TotalM+' '+'Mins.');
                //day 1
                
                if ($data.empDtr[$i].absreason1 !=0){
                    $(".AmArr_d1").html("<span class='text-danger'>"+$data.empDtr[$i].absreason1+"</span>");
                    $(".AmDep_d1").html("<span class='text-danger'>"+$data.empDtr[$i].absreason1+"</span>");
                    $(".PmArr_d1").html("<span class='text-danger'>"+$data.empDtr[$i].absreason1+"</span>");
                    $(".PmDep_d1").html("<span class='text-danger'>"+$data.empDtr[$i].absreason1+"</span>");
                    $(".d1_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason1+"</span>");
                    $(".d1_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason1+"</span>");
                        }
                        else if($data.empDtr[$i].d1 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d1").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d1").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d1").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d1").html('<span class="text-danger">--:--</span>');
                            $(".d1_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d1_MUtime").html('<span class="text-danger">--:--</span>');
                        } else{
                    $(".AmArr_d1").html($data.empDtr[$i].AmArr_d1);
                    $(".AmDep_d1").html($data.empDtr[$i].AmDep_d1);
                    $(".PmArr_d1").html($data.empDtr[$i].PmArr_d1);
                    $(".PmDep_d1").html($data.empDtr[$i].PmDep_d1);
                    $(".d1_HUtime").html($data.empDtr[$i].d1_HUtime);
                    $(".d1_MUtime").html($data.empDtr[$i].d1_MUtime);
                        }
                        //day2
                       
                      if ($data.empDtr[$i].absreason2 !=0){
                    $(".AmArr_d2").html("<span class='text-danger'>"+$data.empDtr[$i].absreason2+"</span>");
                    $(".AmDep_d2").html("<span class='text-danger'>"+$data.empDtr[$i].absreason2+"</span>");
                    $(".PmArr_d2").html("<span class='text-danger'>"+$data.empDtr[$i].absreason2+"</span>");
                    $(".PmDep_d2").html("<span class='text-danger'>"+$data.empDtr[$i].absreason2+"</span>");
                    $(".d2_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason2+"</span>");
                    $(".d2_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason2+"</span>");
                        }
                       else if($data.empDtr[$i].d2 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d2").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d2").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d2").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d2").html('<span class="text-danger">--:--</span>');
                            $(".d2_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d2_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d2").html($data.empDtr[$i].AmArr_d2);
                    $(".AmDep_d2").html($data.empDtr[$i].AmDep_d2);
                    $(".PmArr_d2").html($data.empDtr[$i].PmArr_d2);
                    $(".PmDep_d2").html($data.empDtr[$i].PmDep_d2);
                    $(".d2_HUtime").html($data.empDtr[$i].d2_HUtime);
                    $(".d2_MUtime").html($data.empDtr[$i].d2_MUtime);
                        }
                  
                    //day3
                    
                  if ($data.empDtr[$i].absreason3 != 0){
                  $(".AmArr_d3").html("<span class='text-danger'>"+$data.empDtr[$i].absreason3+"</span>");
                  $(".AmDep_d3").html("<span class='text-danger'>"+$data.empDtr[$i].absreason3+"</span>");
                  $(".PmArr_d3").html("<span class='text-danger'>"+$data.empDtr[$i].absreason3+"</span>");
                  $(".PmDep_d3").html("<span class='text-danger'>"+$data.empDtr[$i].absreason3+"</span>");
                  $(".d3_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason3+"</span>");
                  $(".d3_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason3+"</span>");
                    }
                    else if($data.empDtr[$i].d3 === "00:00 00:00 00:00 00:00"){
                        $(".AmArr_d3").html('<span class="text-danger">--:--</span>');
                        $(".AmDep_d3").html('<span class="text-danger">--:--</span>');
                        $(".PmArr_d3").html('<span class="text-danger">--:--</span>');
                        $(".PmDep_d3").html('<span class="text-danger">--:--</span>');
                        $(".d3_HUtime").html('<span class="text-danger">--:--</span>');
                        $(".d3_MUtime").html('<span class="text-danger">--:--</span>');
                    }else{
                  $(".AmArr_d3").html($data.empDtr[$i].AmArr_d3);
                  $(".AmDep_d3").html($data.empDtr[$i].AmDep_d3);
                  $(".PmArr_d3").html($data.empDtr[$i].PmArr_d3);
                  $(".PmDep_d3").html($data.empDtr[$i].PmDep_d3);
                  $(".d3_HUtime").html($data.empDtr[$i].d3_HUtime);
                  $(".d3_MUtime").html($data.empDtr[$i].d3_MUtime);
                    }
                  
                       //day4
                      
                  if ($data.empDtr[$i].absreason4 !=0){
                  $(".AmArr_d4").html("<span class='text-danger'>"+$data.empDtr[$i].absreason4+"</span>");
                  $(".AmDep_d4").html("<span class='text-danger'>"+$data.empDtr[$i].absreason4+"</span>");
                  $(".PmArr_d4").html("<span class='text-danger'>"+$data.empDtr[$i].absreason4+"</span>");
                  $(".PmDep_d4").html("<span class='text-danger'>"+$data.empDtr[$i].absreason4+"</span>");
                  $(".d4_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason4+"</span>");
                  $(".d4_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason4+"</span>");
                    }
                  else if($data.empDtr[$i].d4 === "00:00 00:00 00:00 00:00"){
                        $(".AmArr_d4").html('<span class="text-danger">--:--</span>');
                        $(".AmDep_d4").html('<span class="text-danger">--:--</span>');
                        $(".PmArr_d4").html('<span class="text-danger">--:--</span>');
                        $(".PmDep_d4").html('<span class="text-danger">--:--</span>');
                        $(".d4_HUtime").html('<span class="text-danger">--:--</span>');
                        $(".d4_MUtime").html('<span class="text-danger">--:--</span>');
                    }else{
                  $(".AmArr_d4").html($data.empDtr[$i].AmArr_d4);
                  $(".AmDep_d4").html($data.empDtr[$i].AmDep_d4);
                  $(".PmArr_d4").html($data.empDtr[$i].PmArr_d4);
                  $(".PmDep_d4").html($data.empDtr[$i].PmDep_d4);
                  $(".d4_HUtime").html($data.empDtr[$i].d4_HUtime);
                  $(".d4_MUtime").html($data.empDtr[$i].d4_MUtime);
                    }
                  
                      //day5
                      
                  if ($data.empDtr[$i].absreason5 !=0){
                  $(".AmArr_d5").html("<span class='text-danger'>"+$data.empDtr[$i].absreason5+"</span>");
                  $(".AmDep_d5").html("<span class='text-danger'>"+$data.empDtr[$i].absreason5+"</span>");
                  $(".PmArr_d5").html("<span class='text-danger'>"+$data.empDtr[$i].absreason5+"</span>");
                  $(".PmDep_d5").html("<span class='text-danger'>"+$data.empDtr[$i].absreason5+"</span>");
                  $(".d5_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason5+"</span>");
                  $(".d5_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason5+"</span>");
                    }
                    else if($data.empDtr[$i].d5 === "00:00 00:00 00:00 00:00"){
                        $(".AmArr_d5").html('<span class="text-danger">--:--</span>');
                        $(".AmDep_d5").html('<span class="text-danger">--:--</span>');
                        $(".PmArr_d5").html('<span class="text-danger">--:--</span>');
                        $(".PmDep_d5").html('<span class="text-danger">--:--</span>');
                        $(".d5_HUtime").html('<span class="text-danger">--:--</span>');
                        $(".d5_MUtime").html('<span class="text-danger">--:--</span>');
                    }else{
                  $(".AmArr_d5").html($data.empDtr[$i].AmArr_d5);
                  $(".AmDep_d5").html($data.empDtr[$i].AmDep_d5);
                  $(".PmArr_d5").html($data.empDtr[$i].PmArr_d5);
                  $(".PmDep_d5").html($data.empDtr[$i].PmDep_d5);
                  $(".d5_HUtime").html($data.empDtr[$i].d5_HUtime);
                  $(".d5_MUtime").html($data.empDtr[$i].d5_MUtime);
                    }
                  
                    //day6
                  
                  if ($data.empDtr[$i].absreason6 !=0){
                  $(".AmArr_d6").html("<span class='text-danger'>"+$data.empDtr[$i].absreason6+"</span>");
                  $(".AmDep_d6").html("<span class='text-danger'>"+$data.empDtr[$i].absreason6+"</span>");
                  $(".PmArr_d6").html("<span class='text-danger'>"+$data.empDtr[$i].absreason6+"</span>");
                  $(".PmDep_d6").html("<span class='text-danger'>"+$data.empDtr[$i].absreason6+"</span>");
                  $(".d6_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason6+"</span>");
                  $(".d6_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason6+"</span>");
                    }
                   else if($data.empDtr[$i].d6 === "00:00 00:00 00:00 00:00"){
                        $(".AmArr_d6").html('<span class="text-danger">--:--</span>');
                        $(".AmDep_d6").html('<span class="text-danger">--:--</span>');
                        $(".PmArr_d6").html('<span class="text-danger">--:--</span>');
                        $(".PmDep_d6").html('<span class="text-danger">--:--</span>');
                        $(".d6_HUtime").html('<span class="text-danger">--:--</span>');
                        $(".d6_MUtime").html('<span class="text-danger">--:--</span>');
                    }else{
                  $(".AmArr_d6").html($data.empDtr[$i].AmArr_d6);
                  $(".AmDep_d6").html($data.empDtr[$i].AmDep_d6);
                  $(".PmArr_d6").html($data.empDtr[$i].PmArr_d6);
                  $(".PmDep_d6").html($data.empDtr[$i].PmDep_d6);
                  $(".d6_HUtime").html($data.empDtr[$i].d6_HUtime);
                  $(".d6_MUtime").html($data.empDtr[$i].d6_MUtime);
                    }
                  
                    //day7
                  
                  if ($data.empDtr[$i].absreason7 !=0){
                  $(".AmArr_d7").html("<span class='text-danger'>"+$data.empDtr[$i].absreason7+"</span>");
                  $(".AmDep_d7").html("<span class='text-danger'>"+$data.empDtr[$i].absreason7+"</span>");
                  $(".PmArr_d7").html("<span class='text-danger'>"+$data.empDtr[$i].absreason7+"</span>");
                  $(".PmDep_d7").html("<span class='text-danger'>"+$data.empDtr[$i].absreason7+"</span>");
                  $(".d7_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason7+"</span>");
                  $(".d7_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason7+"</span>");
                    }
                   else if($data.empDtr[$i].d7 === "00:00 00:00 00:00 00:00"){
                        $(".AmArr_d7").html('<span class="text-danger">--:--</span>');
                        $(".AmDep_d7").html('<span class="text-danger">--:--</span>');
                        $(".PmArr_d7").html('<span class="text-danger">--:--</span>');
                        $(".PmDep_d7").html('<span class="text-danger">--:--</span>');
                        $(".d7_HUtime").html('<span class="text-danger">--:--</span>');
                        $(".d7_MUtime").html('<span class="text-danger">--:--</span>');
                    }else{
                  $(".AmArr_d7").html($data.empDtr[$i].AmArr_d7);
                  $(".AmDep_d7").html($data.empDtr[$i].AmDep_d7);
                  $(".PmArr_d7").html($data.empDtr[$i].PmArr_d7);
                  $(".PmDep_d7").html($data.empDtr[$i].PmDep_d7);
                  $(".d7_HUtime").html($data.empDtr[$i].d7_HUtime);
                  $(".d7_MUtime").html($data.empDtr[$i].d7_MUtime);
                    }
                  
                    //day8
                   
                  if ($data.empDtr[$i].absreason8 !=0){
                  $(".AmArr_d8").html("<span class='text-danger'>"+$data.empDtr[$i].absreason8+"</span>");
                  $(".AmDep_d8").html("<span class='text-danger'>"+$data.empDtr[$i].absreason8+"</span>");
                  $(".PmArr_d8").html("<span class='text-danger'>"+$data.empDtr[$i].absreason8+"</span>");
                  $(".PmDep_d8").html("<span class='text-danger'>"+$data.empDtr[$i].absreason8+"</span>");
                  $(".d8_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason8+"</span>");
                  $(".d8_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason8+"</span>");
                    }
                   else if($data.empDtr[$i].d8 === "00:00 00:00 00:00 00:00"){
                        $(".AmArr_d8").html('<span class="text-danger">--:--</span>');
                        $(".AmDep_d8").html('<span class="text-danger">--:--</span>');
                        $(".PmArr_d8").html('<span class="text-danger">--:--</span>');
                        $(".PmDep_d8").html('<span class="text-danger">--:--</span>');
                        $(".d8_HUtime").html('<span class="text-danger">--:--</span>');
                        $(".d8_MUtime").html('<span class="text-danger">--:--</span>');
                    }else{
                  $(".AmArr_d8").html($data.empDtr[$i].AmArr_d8);
                  $(".AmDep_d8").html($data.empDtr[$i].AmDep_d8);
                  $(".PmArr_d8").html($data.empDtr[$i].PmArr_d8);
                  $(".PmDep_d8").html($data.empDtr[$i].PmDep_d8);
                  $(".d8_HUtime").html($data.empDtr[$i].d8_HUtime);
                  $(".d8_MUtime").html($data.empDtr[$i].d8_MUtime);
                    }
                  
                    //day9
                  
                  if ($data.empDtr[$i].absreason9 !=0){
                  $(".AmArr_d9").html("<span class='text-danger'>"+$data.empDtr[$i].absreason9+"</span>");
                  $(".AmDep_d9").html("<span class='text-danger'>"+$data.empDtr[$i].absreason9+"</span>");
                  $(".PmArr_d9").html("<span class='text-danger'>"+$data.empDtr[$i].absreason9+"</span>");
                  $(".PmDep_d9").html("<span class='text-danger'>"+$data.empDtr[$i].absreason9+"</span>");
                  $(".d9_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason9+"</span>");
                  $(".d9_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason9+"</span>");
                    }
                   else if($data.empDtr[$i].d9 === "00:00 00:00 00:00 00:00"){
                        $(".AmArr_d9").html('<span class="text-danger">--:--</span>');
                        $(".AmDep_d9").html('<span class="text-danger">--:--</span>');
                        $(".PmArr_d9").html('<span class="text-danger">--:--</span>');
                        $(".PmDep_d9").html('<span class="text-danger">--:--</span>');
                        $(".d9_HUtime").html('<span class="text-danger">--:--</span>');
                        $(".d9_MUtime").html('<span class="text-danger">--:--</span>');
                    }else{
                  $(".AmArr_d9").html($data.empDtr[$i].AmArr_d9);
                  $(".AmDep_d9").html($data.empDtr[$i].AmDep_d9);
                  $(".PmArr_d9").html($data.empDtr[$i].PmArr_d9);
                  $(".PmDep_d9").html($data.empDtr[$i].PmDep_d9);
                  $(".d9_HUtime").html($data.empDtr[$i].d9_HUtime);
                  $(".d9_MUtime").html($data.empDtr[$i].d9_MUtime);
                    }
                  
                    //day10
                  
                  if ($data.empDtr[$i].absreason10 !=0){
                  $(".AmArr_d10").html("<span class='text-danger'>"+$data.empDtr[$i].absreason10+"</span>");
                  $(".AmDep_d10").html("<span class='text-danger'>"+$data.empDtr[$i].absreason10+"</span>");
                  $(".PmArr_d10").html("<span class='text-danger'>"+$data.empDtr[$i].absreason10+"</span>");
                  $(".PmDep_d10").html("<span class='text-danger'>"+$data.empDtr[$i].absreason10+"</span>");
                  $(".d10_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason10+"</span>");
                  $(".d10_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason10+"</span>");
                    }
                   else if($data.empDtr[$i].d10 === "00:00 00:00 00:00 00:00"){
                        $(".AmArr_d10").html('<span class="text-danger">--:--</span>');
                        $(".AmDep_d10").html('<span class="text-danger">--:--</span>');
                        $(".PmArr_d10").html('<span class="text-danger">--:--</span>');
                        $(".PmDep_d10").html('<span class="text-danger">--:--</span>');
                        $(".d10_HUtime").html('<span class="text-danger">--:--</span>');
                        $(".d10_MUtime").html('<span class="text-danger">--:--</span>');
                    }else{
                  $(".AmArr_d10").html($data.empDtr[$i].AmArr_d10);
                  $(".AmDep_d10").html($data.empDtr[$i].AmDep_d10);
                  $(".PmArr_d10").html($data.empDtr[$i].PmArr_d10);
                  $(".PmDep_d10").html($data.empDtr[$i].PmDep_d10);
                  $(".d10_HUtime").html($data.empDtr[$i].d10_HUtime);
                  $(".d10_MUtime").html($data.empDtr[$i].d10_MUtime);
                    }
                  
                    //day11
                  
                  if ($data.empDtr[$i].absreason11 !=0){
                    $(".AmArr_d11").html("<span class='text-danger'>"+$data.empDtr[$i].absreason11+"</span>");
                    $(".AmDep_d11").html("<span class='text-danger'>"+$data.empDtr[$i].absreason11+"</span>");
                    $(".PmArr_d11").html("<span class='text-danger'>"+$data.empDtr[$i].absreason11+"</span>");
                    $(".PmDep_d11").html("<span class='text-danger'>"+$data.empDtr[$i].absreason11+"</span>");
                    $(".d11_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason11+"</span>");
                    $(".d11_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason11+"</span>");
                        }
                       else if($data.empDtr[$i].d11 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d11").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d11").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d11").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d11").html('<span class="text-danger">--:--</span>');
                            $(".d11_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d11_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d11").html($data.empDtr[$i].AmArr_d11);
                    $(".AmDep_d11").html($data.empDtr[$i].AmDep_d11);
                    $(".PmArr_d11").html($data.empDtr[$i].PmArr_d11);
                    $(".PmDep_d11").html($data.empDtr[$i].PmDep_d11);
                    $(".d11_HUtime").html($data.empDtr[$i].d11_HUtime);
                    $(".d11_MUtime").html($data.empDtr[$i].d11_MUtime);
                        }
                  
                    //day12
                  
                  if ($data.empDtr[$i].absreason12 !=0){
                    $(".AmArr_d12").html("<span class='text-danger'>"+$data.empDtr[$i].absreason12+"</span>");
                    $(".AmDep_d12").html("<span class='text-danger'>"+$data.empDtr[$i].absreason12+"</span>");
                    $(".PmArr_d12").html("<span class='text-danger'>"+$data.empDtr[$i].absreason12+"</span>");
                    $(".PmDep_d12").html("<span class='text-danger'>"+$data.empDtr[$i].absreason12+"</span>");
                    $(".d12_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason12+"</span>");
                    $(".d12_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason12+"</span>");
                        }
                       else if($data.empDtr[$i].d12 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d12").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d12").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d12").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d12").html('<span class="text-danger">--:--</span>');
                            $(".d12_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d12_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d12").html($data.empDtr[$i].AmArr_d12);
                    $(".AmDep_d12").html($data.empDtr[$i].AmDep_d12);
                    $(".PmArr_d12").html($data.empDtr[$i].PmArr_d12);
                    $(".PmDep_d12").html($data.empDtr[$i].PmDep_d12);
                    $(".d12_HUtime").html($data.empDtr[$i].d12_HUtime);
                    $(".d12_MUtime").html($data.empDtr[$i].d12_MUtime);
                        }
                  
                    //day13
                  
                  if ($data.empDtr[$i].absreason13 !=0){
                    $(".AmArr_d13").html("<span class='text-danger'>"+$data.empDtr[$i].absreason13+"</span>");
                    $(".AmDep_d13").html("<span class='text-danger'>"+$data.empDtr[$i].absreason13+"</span>");
                    $(".PmArr_d13").html("<span class='text-danger'>"+$data.empDtr[$i].absreason13+"</span>");
                    $(".PmDep_d13").html("<span class='text-danger'>"+$data.empDtr[$i].absreason13+"</span>");
                    $(".d13_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason13+"</span>");
                    $(".d13_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason13+"</span>");
                        }
                       else if($data.empDtr[$i].d13 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d13").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d13").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d13").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d13").html('<span class="text-danger">--:--</span>');
                            $(".d13_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d13_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d13").html($data.empDtr[$i].AmArr_d13);
                    $(".AmDep_d13").html($data.empDtr[$i].AmDep_d13);
                    $(".PmArr_d13").html($data.empDtr[$i].PmArr_d13);
                    $(".PmDep_d13").html($data.empDtr[$i].PmDep_d13);
                    $(".d13_HUtime").html($data.empDtr[$i].d13_HUtime);
                    $(".d13_MUtime").html($data.empDtr[$i].d13_MUtime);
                        }
                  
                    //day14
                  
                  if ($data.empDtr[$i].absreason14 !=0){
                    $(".AmArr_d14").html("<span class='text-danger'>"+$data.empDtr[$i].absreason14+"</span>");
                    $(".AmDep_d14").html("<span class='text-danger'>"+$data.empDtr[$i].absreason14+"</span>");
                    $(".PmArr_d14").html("<span class='text-danger'>"+$data.empDtr[$i].absreason14+"</span>");
                    $(".PmDep_d14").html("<span class='text-danger'>"+$data.empDtr[$i].absreason14+"</span>");
                    $(".d14_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason14+"</span>");
                    $(".d14_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason14+"</span>");
                        }
                       else if($data.empDtr[$i].d14 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d14").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d14").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d14").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d14").html('<span class="text-danger">--:--</span>');
                            $(".d14_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d14_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d14").html($data.empDtr[$i].AmArr_d14);
                    $(".AmDep_d14").html($data.empDtr[$i].AmDep_d14);
                    $(".PmArr_d14").html($data.empDtr[$i].PmArr_d14);
                    $(".PmDep_d14").html($data.empDtr[$i].PmDep_d14);
                    $(".d14_HUtime").html($data.empDtr[$i].d14_HUtime);
                    $(".d14_MUtime").html($data.empDtr[$i].d14_MUtime);
                        }
                  
                    //day15
                  
                  if ($data.empDtr[$i].absreason15 !=0){
                    $(".AmArr_d15").html("<span class='text-danger'>"+$data.empDtr[$i].absreason15+"</span>");
                    $(".AmDep_d15").html("<span class='text-danger'>"+$data.empDtr[$i].absreason15+"</span>");
                    $(".PmArr_d15").html("<span class='text-danger'>"+$data.empDtr[$i].absreason15+"</span>");
                    $(".PmDep_d15").html("<span class='text-danger'>"+$data.empDtr[$i].absreason15+"</span>");
                    $(".d15_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason15+"</span>");
                    $(".d15_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason15+"</span>");
                        }
                       else if($data.empDtr[$i].d15 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d15").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d15").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d15").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d15").html('<span class="text-danger">--:--</span>');
                            $(".d15_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d15_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d15").html($data.empDtr[$i].AmArr_d15);
                    $(".AmDep_d15").html($data.empDtr[$i].AmDep_d15);
                    $(".PmArr_d15").html($data.empDtr[$i].PmArr_d15);
                    $(".PmDep_d15").html($data.empDtr[$i].PmDep_d15);
                    $(".d15_HUtime").html($data.empDtr[$i].d15_HUtime);
                    $(".d15_MUtime").html($data.empDtr[$i].d15_MUtime);
                        }
                  
                    //day16
                  
                  if ($data.empDtr[$i].absreason16 !=0){
                    $(".AmArr_d16").html("<span class='text-danger'>"+$data.empDtr[$i].absreason16+"</span>");
                    $(".AmDep_d16").html("<span class='text-danger'>"+$data.empDtr[$i].absreason16+"</span>");
                    $(".PmArr_d16").html("<span class='text-danger'>"+$data.empDtr[$i].absreason16+"</span>");
                    $(".PmDep_d16").html("<span class='text-danger'>"+$data.empDtr[$i].absreason16+"</span>");
                    $(".d16_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason16+"</span>");
                    $(".d16_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason16+"</span>");
                        }
                       else if($data.empDtr[$i].d16 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d16").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d16").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d16").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d16").html('<span class="text-danger">--:--</span>');
                            $(".d16_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d16_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d16").html($data.empDtr[$i].AmArr_d16);
                    $(".AmDep_d16").html($data.empDtr[$i].AmDep_d16);
                    $(".PmArr_d16").html($data.empDtr[$i].PmArr_d16);
                    $(".PmDep_d16").html($data.empDtr[$i].PmDep_d16);
                    $(".d16_HUtime").html($data.empDtr[$i].d16_HUtime);
                    $(".d16_MUtime").html($data.empDtr[$i].d16_MUtime);
                        }
                  
                    //day17
                  
                  if ($data.empDtr[$i].absreason17 !=0){
                    $(".AmArr_d17").html("<span class='text-danger'>"+$data.empDtr[$i].absreason17+"</span>");
                    $(".AmDep_d17").html("<span class='text-danger'>"+$data.empDtr[$i].absreason17+"</span>");
                    $(".PmArr_d17").html("<span class='text-danger'>"+$data.empDtr[$i].absreason17+"</span>");
                    $(".PmDep_d17").html("<span class='text-danger'>"+$data.empDtr[$i].absreason17+"</span>");
                    $(".d17_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason17+"</span>");
                    $(".d17_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason17+"</span>");
                        }
                      else if($data.empDtr[$i].d17 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d17").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d17").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d17").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d17").html('<span class="text-danger">--:--</span>');
                            $(".d17_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d17_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d17").html($data.empDtr[$i].AmArr_d17);
                    $(".AmDep_d17").html($data.empDtr[$i].AmDep_d17);
                    $(".PmArr_d17").html($data.empDtr[$i].PmArr_d17);
                    $(".PmDep_d17").html($data.empDtr[$i].PmDep_d17);
                    $(".d17_HUtime").html($data.empDtr[$i].d17_HUtime);
                    $(".d17_MUtime").html($data.empDtr[$i].d17_MUtime);
                        }
                  
                    //day18
                  
                  if ($data.empDtr[$i].absreason18 !=0){
                    $(".AmArr_d18").html("<span class='text-danger'>"+$data.empDtr[$i].absreason18+"</span>");
                    $(".AmDep_d18").html("<span class='text-danger'>"+$data.empDtr[$i].absreason18+"</span>");
                    $(".PmArr_d18").html("<span class='text-danger'>"+$data.empDtr[$i].absreason18+"</span>");
                    $(".PmDep_d18").html("<span class='text-danger'>"+$data.empDtr[$i].absreason18+"</span>");
                    $(".d18_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason18+"</span>");
                    $(".d18_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason18+"</span>");
                        }
                       else if($data.empDtr[$i].d18 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d18").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d18").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d18").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d18").html('<span class="text-danger">--:--</span>');
                            $(".d18_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d18_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d18").html($data.empDtr[$i].AmArr_d18);
                    $(".AmDep_d18").html($data.empDtr[$i].AmDep_d18);
                    $(".PmArr_d18").html($data.empDtr[$i].PmArr_d18);
                    $(".PmDep_d18").html($data.empDtr[$i].PmDep_d18);
                    $(".d18_HUtime").html($data.empDtr[$i].d18_HUtime);
                    $(".d18_MUtime").html($data.empDtr[$i].d18_MUtime);
                        }
                  
                    //day19
                  
                  if ($data.empDtr[$i].absreason19 !=0){
                    $(".AmArr_d19").html("<span class='text-danger'>"+$data.empDtr[$i].absreason19+"</span>");
                    $(".AmDep_d19").html("<span class='text-danger'>"+$data.empDtr[$i].absreason19+"</span>");
                    $(".PmArr_d19").html("<span class='text-danger'>"+$data.empDtr[$i].absreason19+"</span>");
                    $(".PmDep_d19").html("<span class='text-danger'>"+$data.empDtr[$i].absreason19+"</span>");
                    $(".d19_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason19+"</span>");
                    $(".d19_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason19+"</span>");
                        }
                       else if($data.empDtr[$i].d19 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d19").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d19").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d19").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d19").html('<span class="text-danger">--:--</span>');
                            $(".d19_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d19_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d19").html($data.empDtr[$i].AmArr_d19);
                    $(".AmDep_d19").html($data.empDtr[$i].AmDep_d19);
                    $(".PmArr_d19").html($data.empDtr[$i].PmArr_d19);
                    $(".PmDep_d19").html($data.empDtr[$i].PmDep_d19);
                    $(".d19_HUtime").html($data.empDtr[$i].d19_HUtime);
                    $(".d19_MUtime").html($data.empDtr[$i].d19_MUtime);
                        }
                  
                    //day20
                  
                  if ($data.empDtr[$i].absreason20 !=0){
                    $(".AmArr_d20").html("<span class='text-danger'>"+$data.empDtr[$i].absreason20+"</span>");
                    $(".AmDep_d20").html("<span class='text-danger'>"+$data.empDtr[$i].absreason20+"</span>");
                    $(".PmArr_d20").html("<span class='text-danger'>"+$data.empDtr[$i].absreason20+"</span>");
                    $(".PmDep_d20").html("<span class='text-danger'>"+$data.empDtr[$i].absreason20+"</span>");
                    $(".d20_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason20+"</span>");
                    $(".d20_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason20+"</span>");
                        }
                       else if($data.empDtr[$i].d20 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d20").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d20").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d20").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d20").html('<span class="text-danger">--:--</span>');
                            $(".d20_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d20_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d20").html($data.empDtr[$i].AmArr_d20);
                    $(".AmDep_d20").html($data.empDtr[$i].AmDep_d20);
                    $(".PmArr_d20").html($data.empDtr[$i].PmArr_d20);
                    $(".PmDep_d20").html($data.empDtr[$i].PmDep_d20);
                    $(".d20_HUtime").html($data.empDtr[$i].d20_HUtime);
                    $(".d20_MUtime").html($data.empDtr[$i].d20_MUtime);
                        }
                  
                    //day21
                  
                  if ($data.empDtr[$i].absreason21 !=0){
                    $(".AmArr_d21").html("<span class='text-danger'>"+$data.empDtr[$i].absreason21+"</span>");
                    $(".AmDep_d21").html("<span class='text-danger'>"+$data.empDtr[$i].absreason21+"</span>");
                    $(".PmArr_d21").html("<span class='text-danger'>"+$data.empDtr[$i].absreason21+"</span>");
                    $(".PmDep_d21").html("<span class='text-danger'>"+$data.empDtr[$i].absreason21+"</span>");
                    $(".d21_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason21+"</span>");
                    $(".d21_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason21+"</span>");
                        }
                       else if($data.empDtr[$i].d21 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d21").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d21").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d21").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d21").html('<span class="text-danger">--:--</span>');
                            $(".d21_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d21_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d21").html($data.empDtr[$i].AmArr_d21);
                    $(".AmDep_d21").html($data.empDtr[$i].AmDep_d21);
                    $(".PmArr_d21").html($data.empDtr[$i].PmArr_d21);
                    $(".PmDep_d21").html($data.empDtr[$i].PmDep_d21);
                    $(".d21_HUtime").html($data.empDtr[$i].d21_HUtime);
                    $(".d21_MUtime").html($data.empDtr[$i].d21_MUtime);
                        }
                  
                    //day22
                  
                  if ($data.empDtr[$i].absreason22 !=0){
                    $(".AmArr_d22").html("<span class='text-danger'>"+$data.empDtr[$i].absreason22+"</span>");
                    $(".AmDep_d22").html("<span class='text-danger'>"+$data.empDtr[$i].absreason22+"</span>");
                    $(".PmArr_d22").html("<span class='text-danger'>"+$data.empDtr[$i].absreason22+"</span>");
                    $(".PmDep_d22").html("<span class='text-danger'>"+$data.empDtr[$i].absreason22+"</span>");
                    $(".d22_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason22+"</span>");
                    $(".d22_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason22+"</span>");
                        }
                       else if($data.empDtr[$i].d22 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d22").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d22").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d22").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d22").html('<span class="text-danger">--:--</span>');
                            $(".d22_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d22_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d22").html($data.empDtr[$i].AmArr_d22);
                    $(".AmDep_d22").html($data.empDtr[$i].AmDep_d22);
                    $(".PmArr_d22").html($data.empDtr[$i].PmArr_d22);
                    $(".PmDep_d22").html($data.empDtr[$i].PmDep_d22);
                    $(".d22_HUtime").html($data.empDtr[$i].d22_HUtime);
                    $(".d22_MUtime").html($data.empDtr[$i].d22_MUtime);
                        }
                  
                    //day23
                  
                  if ($data.empDtr[$i].absreason23 !=0){
                    $(".AmArr_d23").html("<span class='text-danger'>"+$data.empDtr[$i].absreason23+"</span>");
                    $(".AmDep_d23").html("<span class='text-danger'>"+$data.empDtr[$i].absreason23+"</span>");
                    $(".PmArr_d23").html("<span class='text-danger'>"+$data.empDtr[$i].absreason23+"</span>");
                    $(".PmDep_d23").html("<span class='text-danger'>"+$data.empDtr[$i].absreason23+"</span>");
                    $(".d23_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason23+"</span>");
                    $(".d23_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason23+"</span>");
                        }
                       else if($data.empDtr[$i].d23 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d23").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d23").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d23").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d23").html('<span class="text-danger">--:--</span>');
                            $(".d23_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d23_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d23").html($data.empDtr[$i].AmArr_d23);
                    $(".AmDep_d23").html($data.empDtr[$i].AmDep_d23);
                    $(".PmArr_d23").html($data.empDtr[$i].PmArr_d23);
                    $(".PmDep_d23").html($data.empDtr[$i].PmDep_d23);
                    $(".d23_HUtime").html($data.empDtr[$i].d23_HUtime);
                    $(".d23_MUtime").html($data.empDtr[$i].d23_MUtime);
                        }
                  
                    //day24
                  
                  if ($data.empDtr[$i].absreason24 !=0){
                    $(".AmArr_d24").html("<span class='text-danger'>"+$data.empDtr[$i].absreason24+"</span>");
                    $(".AmDep_d24").html("<span class='text-danger'>"+$data.empDtr[$i].absreason24+"</span>");
                    $(".PmArr_d24").html("<span class='text-danger'>"+$data.empDtr[$i].absreason24+"</span>");
                    $(".PmDep_d24").html("<span class='text-danger'>"+$data.empDtr[$i].absreason24+"</span>");
                    $(".d24_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason24+"</span>");
                    $(".d24_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason24+"</span>");
                        }
                       else if($data.empDtr[$i].d24 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d24").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d24").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d24").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d24").html('<span class="text-danger">--:--</span>');
                            $(".d24_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d24_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d24").html($data.empDtr[$i].AmArr_d24);
                    $(".AmDep_d24").html($data.empDtr[$i].AmDep_d24);
                    $(".PmArr_d24").html($data.empDtr[$i].PmArr_d24);
                    $(".PmDep_d24").html($data.empDtr[$i].PmDep_d24);
                    $(".d24_HUtime").html($data.empDtr[$i].d24_HUtime);
                    $(".d24_MUtime").html($data.empDtr[$i].d24_MUtime);
                        }
                  
                    //day25
                  
                  if ($data.empDtr[$i].absreason25 !=0){
                    $(".AmArr_d25").html("<span class='text-danger'>"+$data.empDtr[$i].absreason25+"</span>");
                    $(".AmDep_d25").html("<span class='text-danger'>"+$data.empDtr[$i].absreason25+"</span>");
                    $(".PmArr_d25").html("<span class='text-danger'>"+$data.empDtr[$i].absreason25+"</span>");
                    $(".PmDep_d25").html("<span class='text-danger'>"+$data.empDtr[$i].absreason25+"</span>");
                    $(".d25_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason25+"</span>");
                    $(".d25_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason25+"</span>");
                        }
                       else if($data.empDtr[$i].d25 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d25").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d25").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d25").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d25").html('<span class="text-danger">--:--</span>');
                            $(".d25_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d25_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d25").html($data.empDtr[$i].AmArr_d25);
                    $(".AmDep_d25").html($data.empDtr[$i].AmDep_d25);
                    $(".PmArr_d25").html($data.empDtr[$i].PmArr_d25);
                    $(".PmDep_d25").html($data.empDtr[$i].PmDep_d25);
                    $(".d25_HUtime").html($data.empDtr[$i].d25_HUtime);
                    $(".d25_MUtime").html($data.empDtr[$i].d25_MUtime);
                        }
                  
                    //day26
                  
                  if ($data.empDtr[$i].absreason26 !=0){
                    $(".AmArr_d26").html("<span class='text-danger'>"+$data.empDtr[$i].absreason26+"</span>");
                    $(".AmDep_d26").html("<span class='text-danger'>"+$data.empDtr[$i].absreason26+"</span>");
                    $(".PmArr_d26").html("<span class='text-danger'>"+$data.empDtr[$i].absreason26+"</span>");
                    $(".PmDep_d26").html("<span class='text-danger'>"+$data.empDtr[$i].absreason26+"</span>");
                    $(".d26_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason26+"</span>");
                    $(".d26_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason26+"</span>");
                        }
                       else if($data.empDtr[$i].d26 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d26").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d26").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d26").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d26").html('<span class="text-danger">--:--</span>');
                            $(".d26_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d26_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d26").html($data.empDtr[$i].AmArr_d26);
                    $(".AmDep_d26").html($data.empDtr[$i].AmDep_d26);
                    $(".PmArr_d26").html($data.empDtr[$i].PmArr_d26);
                    $(".PmDep_d26").html($data.empDtr[$i].PmDep_d26);
                    $(".d26_HUtime").html($data.empDtr[$i].d26_HUtime);
                    $(".d26_MUtime").html($data.empDtr[$i].d26_MUtime);
                        }
                  
                    //day27
                  
                  if ($data.empDtr[$i].absreason27 !=0){
                    $(".AmArr_d27").html("<span class='text-danger'>"+$data.empDtr[$i].absreason27+"</span>");
                    $(".AmDep_d27").html("<span class='text-danger'>"+$data.empDtr[$i].absreason27+"</span>");
                    $(".PmArr_d27").html("<span class='text-danger'>"+$data.empDtr[$i].absreason27+"</span>");
                    $(".PmDep_d27").html("<span class='text-danger'>"+$data.empDtr[$i].absreason27+"</span>");
                    $(".d27_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason27+"</span>");
                    $(".d27_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason27+"</span>");
                        }
                       else if($data.empDtr[$i].d27 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d27").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d27").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d27").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d27").html('<span class="text-danger">--:--</span>');
                            $(".d27_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d27_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d27").html($data.empDtr[$i].AmArr_d27);
                    $(".AmDep_d27").html($data.empDtr[$i].AmDep_d27);
                    $(".PmArr_d27").html($data.empDtr[$i].PmArr_d27);
                    $(".PmDep_d27").html($data.empDtr[$i].PmDep_d27);
                    $(".d27_HUtime").html($data.empDtr[$i].d27_HUtime);
                    $(".d27_MUtime").html($data.empDtr[$i].d27_MUtime);
                        }
                  
                    //day28
                  
                  if ($data.empDtr[$i].absreason28 !=0){
                    $(".AmArr_d28").html("<span class='text-danger'>"+$data.empDtr[$i].absreason28+"</span>");
                    $(".AmDep_d28").html("<span class='text-danger'>"+$data.empDtr[$i].absreason28+"</span>");
                    $(".PmArr_d28").html("<span class='text-danger'>"+$data.empDtr[$i].absreason28+"</span>");
                    $(".PmDep_d28").html("<span class='text-danger'>"+$data.empDtr[$i].absreason28+"</span>");
                    $(".d28_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason28+"</span>");
                    $(".d28_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason28+"</span>");
                        }
                       else if($data.empDtr[$i].d28 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d28").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d28").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d28").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d28").html('<span class="text-danger">--:--</span>');
                            $(".d28_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d28_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d28").html($data.empDtr[$i].AmArr_d28);
                    $(".AmDep_d28").html($data.empDtr[$i].AmDep_d28);
                    $(".PmArr_d28").html($data.empDtr[$i].PmArr_d28);
                    $(".PmDep_d28").html($data.empDtr[$i].PmDep_d28);
                    $(".d28_HUtime").html($data.empDtr[$i].d28_HUtime);
                    $(".d28_MUtime").html($data.empDtr[$i].d28_MUtime);
                        }
                  
                    //day29
                  
                  if ($data.empDtr[$i].absreason29 !=0){
                    $(".AmArr_d29").html("<span class='text-danger'>"+$data.empDtr[$i].absreason29+"</span>");
                    $(".AmDep_d29").html("<span class='text-danger'>"+$data.empDtr[$i].absreason29+"</span>");
                    $(".PmArr_d29").html("<span class='text-danger'>"+$data.empDtr[$i].absreason29+"</span>");
                    $(".PmDep_d29").html("<span class='text-danger'>"+$data.empDtr[$i].absreason29+"</span>");
                    $(".d29_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason29+"</span>");
                    $(".d29_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason29+"</span>");
                        }
                       else if($data.empDtr[$i].d29 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d29").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d29").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d29").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d29").html('<span class="text-danger">--:--</span>');
                            $(".d29_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d29_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d29").html($data.empDtr[$i].AmArr_d29);
                    $(".AmDep_d29").html($data.empDtr[$i].AmDep_d29);
                    $(".PmArr_d29").html($data.empDtr[$i].PmArr_d29);
                    $(".PmDep_d29").html($data.empDtr[$i].PmDep_d29);
                    $(".d29_HUtime").html($data.empDtr[$i].d29_HUtime);
                    $(".d29_MUtime").html($data.empDtr[$i].d29_MUtime);
                        }
                  
                    //day30
                  
                  if ($data.empDtr[$i].absreason30 !=0){
                    $(".AmArr_d30").html("<span class='text-danger'>"+$data.empDtr[$i].absreason30+"</span>");
                    $(".AmDep_d30").html("<span class='text-danger'>"+$data.empDtr[$i].absreason30+"</span>");
                    $(".PmArr_d30").html("<span class='text-danger'>"+$data.empDtr[$i].absreason30+"</span>");
                    $(".PmDep_d30").html("<span class='text-danger'>"+$data.empDtr[$i].absreason30+"</span>");
                    $(".d30_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason30+"</span>");
                    $(".d30_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason30+"</span>");
                        }
                       else if($data.empDtr[$i].d30 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d30").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d30").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d30").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d30").html('<span class="text-danger">--:--</span>');
                            $(".d30_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d30_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d30").html($data.empDtr[$i].AmArr_d30);
                    $(".AmDep_d30").html($data.empDtr[$i].AmDep_d30);
                    $(".PmArr_d30").html($data.empDtr[$i].PmArr_d30);
                    $(".PmDep_d30").html($data.empDtr[$i].PmDep_d30);
                    $(".d30_HUtime").html($data.empDtr[$i].d30_HUtime);
                    $(".d30_MUtime").html($data.empDtr[$i].d30_MUtime);
                        }
                  
                    //day31
                  
                  if ($data.empDtr[$i].absreason31 !=0){
                    $(".AmArr_d31").html("<span class='text-danger'>"+$data.empDtr[$i].absreason31+"</span>");
                    $(".AmDep_d31").html("<span class='text-danger'>"+$data.empDtr[$i].absreason31+"</span>");
                    $(".PmArr_d31").html("<span class='text-danger'>"+$data.empDtr[$i].absreason31+"</span>");
                    $(".PmDep_d31").html("<span class='text-danger'>"+$data.empDtr[$i].absreason31+"</span>");
                    $(".d31_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason31+"</span>");
                    $(".d31_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason31+"</span>");
                        }
                       else if($data.empDtr[$i].d31 === "00:00 00:00 00:00 00:00"){
                            $(".AmArr_d31").html('<span class="text-danger">--:--</span>');
                            $(".AmDep_d31").html('<span class="text-danger">--:--</span>');
                            $(".PmArr_d31").html('<span class="text-danger">--:--</span>');
                            $(".PmDep_d31").html('<span class="text-danger">--:--</span>');
                            $(".d31_HUtime").html('<span class="text-danger">--:--</span>');
                            $(".d31_MUtime").html('<span class="text-danger">--:--</span>');
                        }else{
                    $(".AmArr_d31").html($data.empDtr[$i].AmArr_d31);
                    $(".AmDep_d31").html($data.empDtr[$i].AmDep_d31);
                    $(".PmArr_d31").html($data.empDtr[$i].PmArr_d31);
                    $(".PmDep_d31").html($data.empDtr[$i].PmDep_d31);
                    $(".d31_HUtime").html($data.empDtr[$i].d31_HUtime);
                    $(".d31_MUtime").html($data.empDtr[$i].d31_MUtime);
                        }
                        return false;
                  }
         
       
        });
       
        // let getDayName = (dateString) =>new Intl.DateTimeFormat('en-Us', { weekday: 'short' }).format(new Date(dateString));
   
        // $(".day1").html(getDayName($month+'/'+1+'/'+$year));
        // $(".day2").html(getDayName($month+'/'+2+'/'+$year));
        // $(".day3").html(getDayName($month+'/'+3+'/'+$year));
        // $(".day4").html(getDayName($month+'/'+4+'/'+$year));
        // $(".day5").html(getDayName($month+'/'+5+'/'+$year));
        // $(".day6").html(getDayName($month+'/'+6+'/'+$year));
        // $(".day7").html(getDayName($month+'/'+7+'/'+$year));
        // $(".day8").html(getDayName($month+'/'+8+'/'+$year));
        // $(".day9").html(getDayName($month+'/'+9+'/'+$year));
        // $(".day10").html(getDayName($month+'/'+10+'/'+$year));
        // $(".day11").html(getDayName($month+'/'+11+'/'+$year));
        // $(".day12").html(getDayName($month+'/'+12+'/'+$year));
        // $(".day13").html(getDayName($month+'/'+13+'/'+$year));
        // $(".day14").html(getDayName($month+'/'+14+'/'+$year));
        // $(".day15").html(getDayName($month+'/'+15+'/'+$year));
        // $(".day16").html(getDayName($month+'/'+16+'/'+$year));
        // $(".day17").html(getDayName($month+'/'+17+'/'+$year));
        // $(".day18").html(getDayName($month+'/'+18+'/'+$year));
        // $(".day19").html(getDayName($month+'/'+19+'/'+$year));
        // $(".day20").html(getDayName($month+'/'+20+'/'+$year));
        // $(".day21").html(getDayName($month+'/'+21+'/'+$year));
        // $(".day22").html(getDayName($month+'/'+22+'/'+$year));
        // $(".day23").html(getDayName($month+'/'+23+'/'+$year));
        // $(".day24").html(getDayName($month+'/'+24+'/'+$year));
        // $(".day25").html(getDayName($month+'/'+25+'/'+$year));
        // $(".day26").html(getDayName($month+'/'+26+'/'+$year));
        // $(".day27").html(getDayName($month+'/'+27+'/'+$year));
        // $(".day28").html(getDayName($month+'/'+28+'/'+$year));
        // $(".day29").html(getDayName($month+'/'+29+'/'+$year));
        // $(".day30").html(getDayName($month+'/'+30+'/'+$year));
        // $(".day31").html(getDayName($month+'/'+31+'/'+$year));
        return false;
    });

    function ClearDtrValue(){
        $(".AmArr_d1").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d1").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d1").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d1").html("<p class='text-danger'>--:--</p>");
        $(".d1_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d1_MUtime").html("<p class='text-danger'>--:--</p>");
     
        $(".AmArr_d2").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d2").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d2").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d2").html("<p class='text-danger'>--:--</p>");
        $(".d2_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d2_MUtime").html("<p class='text-danger'>--:--</p>");
     
        $(".AmArr_d3").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d3").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d3").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d3").html("<p class='text-danger'>--:--</p>");
        $(".d3_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d3_MUtime").html("<p class='text-danger'>--:--</p>");
     
        $(".AmArr_d4").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d4").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d4").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d4").html("<p class='text-danger'>--:--</p>");
        $(".d4_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d4_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d5").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d5").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d5").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d5").html("<p class='text-danger'>--:--</p>");
        $(".d5_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d5_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d6").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d6").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d6").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d6").html("<p class='text-danger'>--:--</p>");
        $(".d6_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d6_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d7").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d7").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d7").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d7").html("<p class='text-danger'>--:--</p>");
        $(".d7_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d7_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d8").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d8").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d8").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d8").html("<p class='text-danger'>--:--</p>");
        $(".d8_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d8_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d9").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d9").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d9").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d9").html("<p class='text-danger'>--:--</p>");
        $(".d9_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d9_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d10").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d10").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d10").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d10").html("<p class='text-danger'>--:--</p>");
        $(".d10_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d10_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d11").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d11").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d11").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d11").html("<p class='text-danger'>--:--</p>");
        $(".d11_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d11_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d12").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d12").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d12").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d12").html("<p class='text-danger'>--:--</p>");
        $(".d12_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d12_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d13").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d13").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d13").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d13").html("<p class='text-danger'>--:--</p>");
        $(".d13_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d13_MUtime").html("<p class='text-danger'>--:--</p>");
     
        $(".AmArr_d14").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d14").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d14").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d14").html("<p class='text-danger'>--:--</p>");
        $(".d14_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d14_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d15").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d15").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d15").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d15").html("<p class='text-danger'>--:--</p>");
        $(".d15_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d15_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d16").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d16").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d16").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d16").html("<p class='text-danger'>--:--</p>");
        $(".d16_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d16_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d17").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d17").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d17").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d17").html("<p class='text-danger'>--:--</p>");
        $(".d17_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d17_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d18").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d18").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d18").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d18").html("<p class='text-danger'>--:--</p>");
        $(".d18_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d18_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d19").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d19").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d19").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d19").html("<p class='text-danger'>--:--</p>");
        $(".d19_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d19_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d20").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d20").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d20").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d20").html("<p class='text-danger'>--:--</p>");
        $(".d20_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d20_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d21").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d21").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d21").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d21").html("<p class='text-danger'>--:--</p>");
        $(".d21_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d21_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d22").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d22").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d22").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d22").html("<p class='text-danger'>--:--</p>");
        $(".d22_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d22_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d23").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d23").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d23").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d23").html("<p class='text-danger'>--:--</p>");
        $(".d23_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d23_MUtime").html("<p class='text-danger'>--:--</p>");
     
        $(".AmArr_d24").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d24").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d24").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d24").html("<p class='text-danger'>--:--</p>");
        $(".d24_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d24_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d25").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d25").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d25").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d25").html("<p class='text-danger'>--:--</p>");
        $(".d25_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d25_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d26").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d26").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d26").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d26").html("<p class='text-danger'>--:--</p>");
        $(".d26_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d26_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d27").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d27").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d27").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d27").html("<p class='text-danger'>--:--</p>");
        $(".d27_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d27_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d28").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d28").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d28").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d28").html("<p class='text-danger'>--:--</p>");
        $(".d28_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d28_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d29").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d29").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d29").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d29").html("<p class='text-danger'>--:--</p>");
        $(".d29_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d29_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d30").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d30").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d30").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d30").html("<p class='text-danger'>--:--</p>");
        $(".d30_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d30_MUtime").html("<p class='text-danger'>--:--</p>");
     
      $(".AmArr_d31").html("<p class='text-danger'>--:--</p>");
        $(".AmDep_d31").html("<p class='text-danger'>--:--</p>");
        $(".PmArr_d31").html("<p class='text-danger'>--:--</p>");
        $(".PmDep_d31").html("<p class='text-danger'>--:--</p>");
        $(".d31_HUtime").html("<p class='text-danger'>--:--</p>");
        $(".d31_MUtime").html("<p class='text-danger'>--:--</p>");
       return false; 
     }
    
    $("#btnDtrPrint").on('click', function (e) {
       
          var $month = ["ss","January","Februry","March","April","May","June","July","August","September","October","November","December"];
              conceptName = $('#dtrDate').val();
              spl = conceptName.split('/');
              month = spl[1];
              year = spl[0];
              
              

           $one = $('.dtrDate option:selected').text($month[month]+' '+ year);
           $two = $('.dtrDate2 option:selected').text($month[month]+' '+ year);

      
           $("#print-Dtrarea").print();   

           return false;
       });
});



