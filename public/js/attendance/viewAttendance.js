
$(document).ready(function(){
    legend();
   var $tableAll =  $("#datatable-buttons").DataTable({

       "responsive": false,
        "processing": true,
        "searching":false,
        "paging":false,
        "ordering":false,
        "bInfo": false,
        // scrollY: 450,
        // scrollX: true,
        // "ajax": {
        //     "url": "/page/attendance/index/*",
        //     "type": "POST",
        // },
         
        columns: [
          
            { data: "temp_birtin", title: "TIN" ,"visible":true},
            { data: "Name", title: "Name", "visible": true },
        
            { data: "d1", title: "1", "visible": true },
            { data: "d2", title: "2", "visible": true },
            { data: "d3", title: "3", "visible": true },
            { data: "d4", title: "4", "visible": true },
            { data: "d5", title: "5", "visible": true },
            { data: "d6", title: "6", "visible": true },
            { data: "d7", title: "7", "visible": true },
            { data: "d8", title: "8", "visible": true },
            { data: "d9", title: "9", "visible": true },
            { data: "d10", title: "10", "visible": true },
            { data: "d11", title: "11", "visible": true },
            { data: "d12", title: "12", "visible": true },
            { data: "d13", title: "13", "visible": true },
            { data: "d14", title: "14", "visible": true },
            { data: "d15", title: "15", "visible": true },
            { data: "d16", title: "16", "visible": true },
            { data: "d17", title: "17", "visible": true },
            { data: "d18", title: "18", "visible": true },
            { data: "d19", title: "19", "visible": true },
            { data: "d20", title: "20", "visible": true },
            { data: "d21", title: "21", "visible": true },
            { data: "d22", title: "22", "visible": true },
            { data: "d23", title: "23", "visible": true },
            { data: "d24", title: "24", "visible": true },
            { data: "d25", title: "25", "visible": true },
            { data: "d26", title: "26", "visible": true },
            { data: "d27", title: "27", "visible": true },
            { data: "d28", title: "28", "visible": true },
            { data: "d29", title: "29", "visible": true },
            { data: "d30", title: "30", "visible": true },
            { data: "d31", title: "31", "visible": true },
            { data: "SL", title: "SL", "visible": true },
            { data: "VL", title: "VL", "visible": true },
            { data: "MC6", title: "MC6", "visible": true },
            { data: "PARL", title: "Parl", "visible": true },
            { data: "x", title: "A", "visible": true },
            { data: "LH", title: "HH", "visible": true },
            { data: "LM", title: "MM", "visible": true },
]
// ,
//         dom: 'QBfrtip',
//         buttons:["excel","copy","pdf"]
        
        
    });
 
    // .buttons().container().appendTo("#datatable-buttons_wrapper .col-md-6:eq(0)")

    $("#division").change(function(){
      $("#dtrDate").val(0);
    });

    $("#dtrDate").on("change",function(e){
        e.preventDefault();
       
        if( $("#division").val() == "0"){
          alert("Please Select Division!");
          return false;
        }

        $division =  $("#division").val();
        
        $date =  this.value;
        $x = $date.split('/');
        $year = $x[0];
        $month = $x[1];
    
        $urldtr = "/page/attendance/getAllattendance/*";
        $.ajax($urldtr, {
          type: 'POST',
          dataType: 'JSON',
          data: { year: $year,
                  month: $month,
                  division: $division
                  },
         }).then(function ($data) {
    
            $tableAll.clear().rows.add($data.attendance).draw();
           
           
         });
         
       return false;
    });


    $("#btnSraPrint").on('click', function (e) {
      $month = ["ss","January","Februry","March","April","May","June","July","August","September","October","November","December"];

      conceptName = $('#dtrDate').val();

      spl = conceptName.split('/')

      month = spl[1];
      year = spl[0];
      $('.dtrDate option:selected').text($month[month]+' '+ year);
      
        $("#print-sra").print();    
    });

    function legend() {
        $.ajax({
          type: 'get',
          url: '/page/attendance/legend/*',
          dataType: 'JSON',
          success: function(data) {
            let x = data.aaData.length; 
            console.log(data.aaData);
            let legend = "";
            let legend2 = "";
            for (let i = 0; i < 12; i++) {
            var code = data.aaData[i].code;
            var desc = data.aaData[i].desc;
            
            legend += '<p style="margin-bottom:0%;">'+code+'-'+desc+'</p>';
            }  

            for (let i = 11; i < x; i++) {
                var code = data.aaData[i].code;
                var desc = data.aaData[i].desc;
                
                legend2 += '<p style="margin-bottom:0%;">'+code+'-'+desc+'</p>';
                }  
    
            $("#legend").html(legend);
            $("#newline").html(legend2);
            
          }
         });
    
      }
});




