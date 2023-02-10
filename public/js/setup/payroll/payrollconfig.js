var $payrollconfig = $("#payrollconfig");
var $btnupdate = $("#btnupdate");

//validate payrollperiod entry
$('#payrollconfig').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'rpayconfig_payroll_year': {
            required: true
        },
        'rpayconfig_branch': {
            required: true
        },
        'rpayconfig_tax_identification_number': {
            required: true
        },
        'rpayconfig_gsis_number': {
            required: true
        },
        'rpayconfig_account_number': {
            required: true
        },
        'rpayconfig_computation_based_on': {
            required: true
        },
        'rpayconfig_number_of_days_year': {
            required: true
        },
        'rpayconfig_number_of_days_month': {
            required: true
        },
        'rpayconfig_number_of_days_current_period': {
            required: true
        },
        'rpayconfig_acpcea_amount': {
            required: true
        },
        'rpayconfig_pera_amount': {
            required: true
        },
        'rpayconfig_employee_gsis_rate': {
            required: true
        },
        'rpayconfig_employer_gsis_rate': {
            required: true
        },
        'rpayconfig_employer_pagibig_amount': {
            required: true
        },
        'rpayconfig_philhealth_rate_fixed': {
            required: true
        },
        'rpayconfig_philhealth_rate_percent': {
            required: true
        },
        'rpayconfig_philhealth_rate_fixed2': {
            required: true
        },
        'rpayconfig_monthly_ecola_amount': {
            required: true
        },
        'rpayconfig_monthly_regular_overtime_rate': {
            required: true
        },
        'rpayconfig_monthly_regular_nightdiff_rate': {
            required: true
        },
        'rpayconfig_monthly_regular_overtime_nightdiff_rate': {
            required: true
        },
        'rpayconfig_monthly_regular_overtime_excess_rate': {
            required: true
        },
        'rpayconfig_monthly_restday_overtime_rate': {
            required: true
        },
        'rpayconfig_monthly_restday_excess_rate': {
            required: true
        },

        'rpayconfig_monthly_special_holiday_overtime_rate': {
            required: true
        },
        'rpayconfig_monthly_special_holiday_excess_rate': {
            required: true
        },
        'rpayconfig_monthly_special_holiday_restday_overtime_rate': {
            required: true
        },
        'rpayconfig_monthly_special_holiday_restday_excess_rate': {
            required: true
        },
        'rpayconfig_monthly_legal_holiday_overtime_rate': {
            required: true
        },
        'rpayconfig_monthly_legal_holiday_excess_rate': {
            required: true
        },
        'rpayconfig_monthly_legal_holiday_restday_overtime_rate': {
            required: true
        },
        'rpayconfig_monthly_legal_holiday_restday_excess_rate': {
            required: true
        },
        'rpayconfig_daily_e_cola_amount': {
            required: true
        },
        'rpayconfig_daily_regular_overtime_rate': {
            required: true
        },
        'rpayconfig_daily_regular_nightdiff_rate': {
            required: true
        },
        'rpayconfig_daily_regular_overtime_nightdiff_rate': {
            required: true
        },

        'rpayconfig_daily_regular_overtime_excess_rate': {
            required: true
        },
        'rpayconfig_daily_restday_overtime_rate': {
            required: true
        },
        'rpayconfig_daily_restday_excess_rate': {
            required: true
        },
        'rpayconfig_daily_special_holiday_overtime_rate': {
            required: true
        },
        'rpayconfig_daily_special_holiday_excess_rate': {
            required: true
        },
        'rpayconfig_daily_special_holiday_restday_overtime_rate': {
            required: true
        },
        'rpayconfig_daily_special_holiday_restday_excess_rate': {
            required: true
        },
        'rpayconfig_daily_legal_holiday_overtime_rate': {
            required: true
        },
        'rpayconfig_daily_legal_holiday_excess_rate': {
            required: true
        },
        'rpayconfig_daily_legal_holiday_restday_overtime_rate': {
            required: true
        },
        'rpayconfig_daily_legal_holiday_restday_excess_rate': {
            required: true
        }
    },
    invalidHandler: function (event, validator) {
        // 'this' refers to the form
        var errors = validator.numberOfInvalids();
        if (errors) {
            Swal.fire(
                'Error',
                'Field with error needs to be filled or corrected.',
                'error'
            )

        }
    },
    submitHandler: function (form) {

        $url = '/page/setup/payroll/payrollconfig/' + ['edit'] + '/*'
        data = $("#payrollconfig").serialize();
        // console.log(data);
        // alert(data);


        $.ajax($url, {
            type: 'POST',
            dataType: 'JSON',
            data: data
        }).then(function ($data) {
            // reload family members
            //   console.log($data.educations);
            // alert('xxxx');
            console.log($data);
            alert('x')

        });
        return false;
    }
});
$btnupdate.on('click', function () {
    Swal.fire(
        'Success',
        'Configuration updated successfully.',
        'success'
    )
});


