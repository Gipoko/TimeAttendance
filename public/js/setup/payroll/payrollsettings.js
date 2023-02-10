var $payrollsettings = $("#payrollsetings");
var $btnupdate = $("#btnupdate");



//validate payrollperiod entry
$('#payrollsettings').validate({
    focusInvalid: false,
    ignore: [],
    rules: {
        'rpaysettings_pagibig_employee': {
            required: true
        },
        'rpaysettings_pagibig_employer': {

            required: true
        },
        'rpaysettings_min_takehomepay': {

            required: true
        },
        'rpaysettings_overtime': {

            required: true
        },
        'rpaysettings_standard_workinghours': {

            required: true
        }
        ,
        'rpaysettings_allowed_overtime_hours_beyond': {

            required: true
        }
        ,
        'rpaysettings_graceperiod': {

            required: true
        }
        ,
        'rpaysettings_night_hours_between_from': {

            required: true
        }
        ,
        'rpaysettigs_night_hours_between_to': {

            required: true
        }
        ,
        'rpaysettings_status': {

            required: true
        }
        ,
        'rpaysettings_modifiedby': {

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

        $url = '/page/attendance/' + ['upload'] + '/*',
            data = $("#payrollsettings").serialize();
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
        'Settings updated successfully.',
        'success'
    )
});

