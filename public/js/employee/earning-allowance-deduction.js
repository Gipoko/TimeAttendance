
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

    
       
        loadGetDetailsAllowanceEarningsDeductions()
   
    

    function loadGetDetailsAllowanceEarningsDeductions() {
       
        $url = "/page/employee/details/earning_allowance_deduction/getDetailsAllowanceEarningsDeductions/*";
        var $xhr = $.ajax({
            type: 'POST',
            url: $url,
          
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
       window.id =  $data[5].id;

        return false;
    }