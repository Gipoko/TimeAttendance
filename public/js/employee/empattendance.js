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
 
    $urldtr = "/page/employee/details/empattendance/getEmpDtr/*";
    $.ajax($urldtr, {
      type: 'POST',
      dataType: 'JSON',
      cache: false,
      data: { year: $year,
              month: $month
              },
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
            // Swal.fire(
            //     '<p class="text-primary">DTR of</p>' +' - '+$EmpName,
            //     '<p class="text-success">For the month of</p> '+'  '+ $date,
            //     'success'
            //   );
           
         
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
            //day 1
           
            if ($data.empDtr[$i].absreason1 !=0){
        $("#AmArr_d1").html("<span class='text-danger'>"+$data.empDtr[$i].absreason1+"</span>");
        $("#AmDep_d1").html("<span class='text-danger'>"+$data.empDtr[$i].absreason1+"</span>");
        $("#PmArr_d1").html("<span class='text-danger'>"+$data.empDtr[$i].absreason1+"</span>");
        $("#PmDep_d1").html("<span class='text-danger'>"+$data.empDtr[$i].absreason1+"</span>");
        $("#d1_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason1+"</span>");
        $("#d1_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason1+"</span>");
            }
            else if($data.empDtr[$i].d1 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d1").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d1").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d1").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d1").html('<span class="text-danger">--:--</span>');
                $("#d1_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d1_MUtime").html('<span class="text-danger">--:--</span>');
            } else{
        $("#AmArr_d1").html($data.empDtr[$i].AmArr_d1);
        $("#AmDep_d1").html($data.empDtr[$i].AmDep_d1);
        $("#PmArr_d1").html($data.empDtr[$i].PmArr_d1);
        $("#PmDep_d1").html($data.empDtr[$i].PmDep_d1);
        $("#d1_HUtime").html($data.empDtr[$i].d1_HUtime);
        $("#d1_MUtime").html($data.empDtr[$i].d1_MUtime);
            }
            //day2
           
          if ($data.empDtr[$i].absreason2 !=0){
        $("#AmArr_d2").html("<span class='text-danger'>"+$data.empDtr[$i].absreason2+"</span>");
        $("#AmDep_d2").html("<span class='text-danger'>"+$data.empDtr[$i].absreason2+"</span>");
        $("#PmArr_d2").html("<span class='text-danger'>"+$data.empDtr[$i].absreason2+"</span>");
        $("#PmDep_d2").html("<span class='text-danger'>"+$data.empDtr[$i].absreason2+"</span>");
        $("#d2_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason2+"</span>");
        $("#d2_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason2+"</span>");
            }
            if($data.empDtr[$i].d2 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d2").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d2").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d2").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d2").html('<span class="text-danger">--:--</span>');
                $("#d2_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d2_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d2").html($data.empDtr[$i].AmArr_d2);
        $("#AmDep_d2").html($data.empDtr[$i].AmDep_d2);
        $("#PmArr_d2").html($data.empDtr[$i].PmArr_d2);
        $("#PmDep_d2").html($data.empDtr[$i].PmDep_d2);
        $("#d2_HUtime").html($data.empDtr[$i].d2_HUtime);
        $("#d2_MUtime").html($data.empDtr[$i].d2_MUtime);
            }

        //day3
        
      if ($data.empDtr[$i].absreason3 !=0){
    $("#AmArr_d3").html("<span class='text-danger'>"+$data.empDtr[$i].absreason3+"</span>");
    $("#AmDep_d3").html("<span class='text-danger'>"+$data.empDtr[$i].absreason3+"</span>");
    $("#PmArr_d3").html("<span class='text-danger'>"+$data.empDtr[$i].absreason3+"</span>");
    $("#PmDep_d3").html("<span class='text-danger'>"+$data.empDtr[$i].absreason3+"</span>");
    $("#d3_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason3+"</span>");
    $("#d3_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason3+"</span>");
        }
        if($data.empDtr[$i].d3 === "00:00 00:00 00:00 00:00"){
            $("#AmArr_d3").html('<span class="text-danger">--:--</span>');
            $("#AmDep_d3").html('<span class="text-danger">--:--</span>');
            $("#PmArr_d3").html('<span class="text-danger">--:--</span>');
            $("#PmDep_d3").html('<span class="text-danger">--:--</span>');
            $("#d3_HUtime").html('<span class="text-danger">--:--</span>');
            $("#d3_MUtime").html('<span class="text-danger">--:--</span>');
        }else{
    $("#AmArr_d3").html($data.empDtr[$i].AmArr_d3);
    $("#AmDep_d3").html($data.empDtr[$i].AmDep_d3);
    $("#PmArr_d3").html($data.empDtr[$i].PmArr_d3);
    $("#PmDep_d3").html($data.empDtr[$i].PmDep_d3);
    $("#d3_HUtime").html($data.empDtr[$i].d3_HUtime);
    $("#d3_MUtime").html($data.empDtr[$i].d3_MUtime);
        }

           //day4
          
      if ($data.empDtr[$i].absreason4 !=0){
    $("#AmArr_d4").html("<span class='text-danger'>"+$data.empDtr[$i].absreason4+"</span>");
    $("#AmDep_d4").html("<span class='text-danger'>"+$data.empDtr[$i].absreason4+"</span>");
    $("#PmArr_d4").html("<span class='text-danger'>"+$data.empDtr[$i].absreason4+"</span>");
    $("#PmDep_d4").html("<span class='text-danger'>"+$data.empDtr[$i].absreason4+"</span>");
    $("#d4_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason4+"</span>");
    $("#d4_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason4+"</span>");
        }
        if($data.empDtr[$i].d4 === "00:00 00:00 00:00 00:00"){
            $("#AmArr_d4").html('<span class="text-danger">--:--</span>');
            $("#AmDep_d4").html('<span class="text-danger">--:--</span>');
            $("#PmArr_d4").html('<span class="text-danger">--:--</span>');
            $("#PmDep_d4").html('<span class="text-danger">--:--</span>');
            $("#d4_HUtime").html('<span class="text-danger">--:--</span>');
            $("#d4_MUtime").html('<span class="text-danger">--:--</span>');
        }else{
    $("#AmArr_d4").html($data.empDtr[$i].AmArr_d4);
    $("#AmDep_d4").html($data.empDtr[$i].AmDep_d4);
    $("#PmArr_d4").html($data.empDtr[$i].PmArr_d4);
    $("#PmDep_d4").html($data.empDtr[$i].PmDep_d4);
    $("#d4_HUtime").html($data.empDtr[$i].d4_HUtime);
    $("#d4_MUtime").html($data.empDtr[$i].d4_MUtime);
        }

          //day5
          
      if ($data.empDtr[$i].absreason5 !=0){
    $("#AmArr_d5").html("<span class='text-danger'>"+$data.empDtr[$i].absreason5+"</span>");
    $("#AmDep_d5").html("<span class='text-danger'>"+$data.empDtr[$i].absreason5+"</span>");
    $("#PmArr_d5").html("<span class='text-danger'>"+$data.empDtr[$i].absreason5+"</span>");
    $("#PmDep_d5").html("<span class='text-danger'>"+$data.empDtr[$i].absreason5+"</span>");
    $("#d5_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason5+"</span>");
    $("#d5_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason5+"</span>");
        }
        if($data.empDtr[$i].d5 === "00:00 00:00 00:00 00:00"){
            $("#AmArr_d5").html('<span class="text-danger">--:--</span>');
            $("#AmDep_d5").html('<span class="text-danger">--:--</span>');
            $("#PmArr_d5").html('<span class="text-danger">--:--</span>');
            $("#PmDep_d5").html('<span class="text-danger">--:--</span>');
            $("#d5_HUtime").html('<span class="text-danger">--:--</span>');
            $("#d5_MUtime").html('<span class="text-danger">--:--</span>');
        }else{
    $("#AmArr_d5").html($data.empDtr[$i].AmArr_d5);
    $("#AmDep_d5").html($data.empDtr[$i].AmDep_d5);
    $("#PmArr_d5").html($data.empDtr[$i].PmArr_d5);
    $("#PmDep_d5").html($data.empDtr[$i].PmDep_d5);
    $("#d5_HUtime").html($data.empDtr[$i].d5_HUtime);
    $("#d5_MUtime").html($data.empDtr[$i].d5_MUtime);
        }

        //day6
      
      if ($data.empDtr[$i].absreason6 !=0){
    $("#AmArr_d6").html("<span class='text-danger'>"+$data.empDtr[$i].absreason6+"</span>");
    $("#AmDep_d6").html("<span class='text-danger'>"+$data.empDtr[$i].absreason6+"</span>");
    $("#PmArr_d6").html("<span class='text-danger'>"+$data.empDtr[$i].absreason6+"</span>");
    $("#PmDep_d6").html("<span class='text-danger'>"+$data.empDtr[$i].absreason6+"</span>");
    $("#d6_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason6+"</span>");
    $("#d6_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason6+"</span>");
        }
        if($data.empDtr[$i].d6 === "00:00 00:00 00:00 00:00"){
            $("#AmArr_d6").html('<span class="text-danger">--:--</span>');
            $("#AmDep_d6").html('<span class="text-danger">--:--</span>');
            $("#PmArr_d6").html('<span class="text-danger">--:--</span>');
            $("#PmDep_d6").html('<span class="text-danger">--:--</span>');
            $("#d6_HUtime").html('<span class="text-danger">--:--</span>');
            $("#d6_MUtime").html('<span class="text-danger">--:--</span>');
        }else{
    $("#AmArr_d6").html($data.empDtr[$i].AmArr_d6);
    $("#AmDep_d6").html($data.empDtr[$i].AmDep_d6);
    $("#PmArr_d6").html($data.empDtr[$i].PmArr_d6);
    $("#PmDep_d6").html($data.empDtr[$i].PmDep_d6);
    $("#d6_HUtime").html($data.empDtr[$i].d6_HUtime);
    $("#d6_MUtime").html($data.empDtr[$i].d6_MUtime);
        }

        //day7
      
      if ($data.empDtr[$i].absreason7 !=0){
    $("#AmArr_d7").html("<span class='text-danger'>"+$data.empDtr[$i].absreason7+"</span>");
    $("#AmDep_d7").html("<span class='text-danger'>"+$data.empDtr[$i].absreason7+"</span>");
    $("#PmArr_d7").html("<span class='text-danger'>"+$data.empDtr[$i].absreason7+"</span>");
    $("#PmDep_d7").html("<span class='text-danger'>"+$data.empDtr[$i].absreason7+"</span>");
    $("#d7_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason7+"</span>");
    $("#d7_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason7+"</span>");
        }
        if($data.empDtr[$i].d7 === "00:00 00:00 00:00 00:00"){
            $("#AmArr_d7").html('<span class="text-danger">--:--</span>');
            $("#AmDep_d7").html('<span class="text-danger">--:--</span>');
            $("#PmArr_d7").html('<span class="text-danger">--:--</span>');
            $("#PmDep_d7").html('<span class="text-danger">--:--</span>');
            $("#d7_HUtime").html('<span class="text-danger">--:--</span>');
            $("#d7_MUtime").html('<span class="text-danger">--:--</span>');
        }else{
    $("#AmArr_d7").html($data.empDtr[$i].AmArr_d7);
    $("#AmDep_d7").html($data.empDtr[$i].AmDep_d7);
    $("#PmArr_d7").html($data.empDtr[$i].PmArr_d7);
    $("#PmDep_d7").html($data.empDtr[$i].PmDep_d7);
    $("#d7_HUtime").html($data.empDtr[$i].d7_HUtime);
    $("#d7_MUtime").html($data.empDtr[$i].d7_MUtime);
        }

        //day8
       
      if ($data.empDtr[$i].absreason8 !=0){
    $("#AmArr_d8").html("<span class='text-danger'>"+$data.empDtr[$i].absreason8+"</span>");
    $("#AmDep_d8").html("<span class='text-danger'>"+$data.empDtr[$i].absreason8+"</span>");
    $("#PmArr_d8").html("<span class='text-danger'>"+$data.empDtr[$i].absreason8+"</span>");
    $("#PmDep_d8").html("<span class='text-danger'>"+$data.empDtr[$i].absreason8+"</span>");
    $("#d8_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason8+"</span>");
    $("#d8_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason8+"</span>");
        }
        if($data.empDtr[$i].d8 === "00:00 00:00 00:00 00:00"){
            $("#AmArr_d8").html('<span class="text-danger">--:--</span>');
            $("#AmDep_d8").html('<span class="text-danger">--:--</span>');
            $("#PmArr_d8").html('<span class="text-danger">--:--</span>');
            $("#PmDep_d8").html('<span class="text-danger">--:--</span>');
            $("#d8_HUtime").html('<span class="text-danger">--:--</span>');
            $("#d8_MUtime").html('<span class="text-danger">--:--</span>');
        }else{
    $("#AmArr_d8").html($data.empDtr[$i].AmArr_d8);
    $("#AmDep_d8").html($data.empDtr[$i].AmDep_d8);
    $("#PmArr_d8").html($data.empDtr[$i].PmArr_d8);
    $("#PmDep_d8").html($data.empDtr[$i].PmDep_d8);
    $("#d8_HUtime").html($data.empDtr[$i].d8_HUtime);
    $("#d8_MUtime").html($data.empDtr[$i].d8_MUtime);
        }

        //day9
     
      if ($data.empDtr[$i].absreason9 !=0){
    $("#AmArr_d9").html("<span class='text-danger'>"+$data.empDtr[$i].absreason9+"</span>");
    $("#AmDep_d9").html("<span class='text-danger'>"+$data.empDtr[$i].absreason9+"</span>");
    $("#PmArr_d9").html("<span class='text-danger'>"+$data.empDtr[$i].absreason9+"</span>");
    $("#PmDep_d9").html("<span class='text-danger'>"+$data.empDtr[$i].absreason9+"</span>");
    $("#d9_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason9+"</span>");
    $("#d9_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason9+"</span>");
        }
        if($data.empDtr[$i].d9 === "00:00 00:00 00:00 00:00"){
            $("#AmArr_d9").html('<span class="text-danger">--:--</span>');
            $("#AmDep_d9").html('<span class="text-danger">--:--</span>');
            $("#PmArr_d9").html('<span class="text-danger">--:--</span>');
            $("#PmDep_d9").html('<span class="text-danger">--:--</span>');
            $("#d9_HUtime").html('<span class="text-danger">--:--</span>');
            $("#d9_MUtime").html('<span class="text-danger">--:--</span>');
        }else{
    $("#AmArr_d9").html($data.empDtr[$i].AmArr_d9);
    $("#AmDep_d9").html($data.empDtr[$i].AmDep_d9);
    $("#PmArr_d9").html($data.empDtr[$i].PmArr_d9);
    $("#PmDep_d9").html($data.empDtr[$i].PmDep_d9);
    $("#d9_HUtime").html($data.empDtr[$i].d9_HUtime);
    $("#d9_MUtime").html($data.empDtr[$i].d9_MUtime);
        }

        //day10
      
      if ($data.empDtr[$i].absreason10 !=0){
    $("#AmArr_d10").html("<span class='text-danger'>"+$data.empDtr[$i].absreason10+"</span>");
    $("#AmDep_d10").html("<span class='text-danger'>"+$data.empDtr[$i].absreason10+"</span>");
    $("#PmArr_d10").html("<span class='text-danger'>"+$data.empDtr[$i].absreason10+"</span>");
    $("#PmDep_d10").html("<span class='text-danger'>"+$data.empDtr[$i].absreason10+"</span>");
    $("#d10_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason10+"</span>");
    $("#d10_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason10+"</span>");
        }
        if($data.empDtr[$i].d10 === "00:00 00:00 00:00 00:00"){
            $("#AmArr_d10").html('<span class="text-danger">--:--</span>');
            $("#AmDep_d10").html('<span class="text-danger">--:--</span>');
            $("#PmArr_d10").html('<span class="text-danger">--:--</span>');
            $("#PmDep_d10").html('<span class="text-danger">--:--</span>');
            $("#d10_HUtime").html('<span class="text-danger">--:--</span>');
            $("#d10_MUtime").html('<span class="text-danger">--:--</span>');
        }else{
    $("#AmArr_d10").html($data.empDtr[$i].AmArr_d10);
    $("#AmDep_d10").html($data.empDtr[$i].AmDep_d10);
    $("#PmArr_d10").html($data.empDtr[$i].PmArr_d10);
    $("#PmDep_d10").html($data.empDtr[$i].PmDep_d10);
    $("#d10_HUtime").html($data.empDtr[$i].d10_HUtime);
    $("#d10_MUtime").html($data.empDtr[$i].d10_MUtime);
        }

        //day11
      
      if ($data.empDtr[$i].absreason11 !=0){
        $("#AmArr_d11").html("<span class='text-danger'>"+$data.empDtr[$i].absreason11+"</span>");
        $("#AmDep_d11").html("<span class='text-danger'>"+$data.empDtr[$i].absreason11+"</span>");
        $("#PmArr_d11").html("<span class='text-danger'>"+$data.empDtr[$i].absreason11+"</span>");
        $("#PmDep_d11").html("<span class='text-danger'>"+$data.empDtr[$i].absreason11+"</span>");
        $("#d11_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason11+"</span>");
        $("#d11_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason11+"</span>");
            }
            if($data.empDtr[$i].d11 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d11").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d11").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d11").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d11").html('<span class="text-danger">--:--</span>');
                $("#d11_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d11_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d11").html($data.empDtr[$i].AmArr_d11);
        $("#AmDep_d11").html($data.empDtr[$i].AmDep_d11);
        $("#PmArr_d11").html($data.empDtr[$i].PmArr_d11);
        $("#PmDep_d11").html($data.empDtr[$i].PmDep_d11);
        $("#d11_HUtime").html($data.empDtr[$i].d11_HUtime);
        $("#d11_MUtime").html($data.empDtr[$i].d11_MUtime);
            }

        //day12
      
      if ($data.empDtr[$i].absreason12 !=0){
        $("#AmArr_d12").html("<span class='text-danger'>"+$data.empDtr[$i].absreason12+"</span>");
        $("#AmDep_d12").html("<span class='text-danger'>"+$data.empDtr[$i].absreason12+"</span>");
        $("#PmArr_d12").html("<span class='text-danger'>"+$data.empDtr[$i].absreason12+"</span>");
        $("#PmDep_d12").html("<span class='text-danger'>"+$data.empDtr[$i].absreason12+"</span>");
        $("#d12_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason12+"</span>");
        $("#d12_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason12+"</span>");
            }
            if($data.empDtr[$i].d12 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d12").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d12").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d12").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d12").html('<span class="text-danger">--:--</span>');
                $("#d12_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d12_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d12").html($data.empDtr[$i].AmArr_d12);
        $("#AmDep_d12").html($data.empDtr[$i].AmDep_d12);
        $("#PmArr_d12").html($data.empDtr[$i].PmArr_d12);
        $("#PmDep_d12").html($data.empDtr[$i].PmDep_d12);
        $("#d12_HUtime").html($data.empDtr[$i].d12_HUtime);
        $("#d12_MUtime").html($data.empDtr[$i].d12_MUtime);
            }

        //day13
      
      if ($data.empDtr[$i].absreason13 !=0){
        $("#AmArr_d13").html("<span class='text-danger'>"+$data.empDtr[$i].absreason13+"</span>");
        $("#AmDep_d13").html("<span class='text-danger'>"+$data.empDtr[$i].absreason13+"</span>");
        $("#PmArr_d13").html("<span class='text-danger'>"+$data.empDtr[$i].absreason13+"</span>");
        $("#PmDep_d13").html("<span class='text-danger'>"+$data.empDtr[$i].absreason13+"</span>");
        $("#d13_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason13+"</span>");
        $("#d13_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason13+"</span>");
            }
            if($data.empDtr[$i].d13 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d13").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d13").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d13").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d13").html('<span class="text-danger">--:--</span>');
                $("#d13_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d13_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d13").html($data.empDtr[$i].AmArr_d13);
        $("#AmDep_d13").html($data.empDtr[$i].AmDep_d13);
        $("#PmArr_d13").html($data.empDtr[$i].PmArr_d13);
        $("#PmDep_d13").html($data.empDtr[$i].PmDep_d13);
        $("#d13_HUtime").html($data.empDtr[$i].d13_HUtime);
        $("#d13_MUtime").html($data.empDtr[$i].d13_MUtime);
            }

        //day14
      
      if ($data.empDtr[$i].absreason14 !=0){
        $("#AmArr_d14").html("<span class='text-danger'>"+$data.empDtr[$i].absreason14+"</span>");
        $("#AmDep_d14").html("<span class='text-danger'>"+$data.empDtr[$i].absreason14+"</span>");
        $("#PmArr_d14").html("<span class='text-danger'>"+$data.empDtr[$i].absreason14+"</span>");
        $("#PmDep_d14").html("<span class='text-danger'>"+$data.empDtr[$i].absreason14+"</span>");
        $("#d14_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason14+"</span>");
        $("#d14_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason14+"</span>");
            }
            if($data.empDtr[$i].d14 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d14").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d14").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d14").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d14").html('<span class="text-danger">--:--</span>');
                $("#d14_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d14_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d14").html($data.empDtr[$i].AmArr_d14);
        $("#AmDep_d14").html($data.empDtr[$i].AmDep_d14);
        $("#PmArr_d14").html($data.empDtr[$i].PmArr_d14);
        $("#PmDep_d14").html($data.empDtr[$i].PmDep_d14);
        $("#d14_HUtime").html($data.empDtr[$i].d14_HUtime);
        $("#d14_MUtime").html($data.empDtr[$i].d14_MUtime);
            }

        //day15
      
      if ($data.empDtr[$i].absreason15 !=0){
        $("#AmArr_d15").html("<span class='text-danger'>"+$data.empDtr[$i].absreason15+"</span>");
        $("#AmDep_d15").html("<span class='text-danger'>"+$data.empDtr[$i].absreason15+"</span>");
        $("#PmArr_d15").html("<span class='text-danger'>"+$data.empDtr[$i].absreason15+"</span>");
        $("#PmDep_d15").html("<span class='text-danger'>"+$data.empDtr[$i].absreason15+"</span>");
        $("#d15_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason15+"</span>");
        $("#d15_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason15+"</span>");
            }
            if($data.empDtr[$i].d15 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d15").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d15").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d15").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d15").html('<span class="text-danger">--:--</span>');
                $("#d15_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d15_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d15").html($data.empDtr[$i].AmArr_d15);
        $("#AmDep_d15").html($data.empDtr[$i].AmDep_d15);
        $("#PmArr_d15").html($data.empDtr[$i].PmArr_d15);
        $("#PmDep_d15").html($data.empDtr[$i].PmDep_d15);
        $("#d15_HUtime").html($data.empDtr[$i].d15_HUtime);
        $("#d15_MUtime").html($data.empDtr[$i].d15_MUtime);
            }

        //day16
      
      if ($data.empDtr[$i].absreason16 !=0){
        $("#AmArr_d16").html("<span class='text-danger'>"+$data.empDtr[$i].absreason16+"</span>");
        $("#AmDep_d16").html("<span class='text-danger'>"+$data.empDtr[$i].absreason16+"</span>");
        $("#PmArr_d16").html("<span class='text-danger'>"+$data.empDtr[$i].absreason16+"</span>");
        $("#PmDep_d16").html("<span class='text-danger'>"+$data.empDtr[$i].absreason16+"</span>");
        $("#d16_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason16+"</span>");
        $("#d16_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason16+"</span>");
            }
            if($data.empDtr[$i].d16 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d16").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d16").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d16").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d16").html('<span class="text-danger">--:--</span>');
                $("#d16_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d16_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d16").html($data.empDtr[$i].AmArr_d16);
        $("#AmDep_d16").html($data.empDtr[$i].AmDep_d16);
        $("#PmArr_d16").html($data.empDtr[$i].PmArr_d16);
        $("#PmDep_d16").html($data.empDtr[$i].PmDep_d16);
        $("#d16_HUtime").html($data.empDtr[$i].d16_HUtime);
        $("#d16_MUtime").html($data.empDtr[$i].d16_MUtime);
            }

        //day17
      
      if ($data.empDtr[$i].absreason17 !=0){
        $("#AmArr_d17").html("<span class='text-danger'>"+$data.empDtr[$i].absreason17+"</span>");
        $("#AmDep_d17").html("<span class='text-danger'>"+$data.empDtr[$i].absreason17+"</span>");
        $("#PmArr_d17").html("<span class='text-danger'>"+$data.empDtr[$i].absreason17+"</span>");
        $("#PmDep_d17").html("<span class='text-danger'>"+$data.empDtr[$i].absreason17+"</span>");
        $("#d17_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason17+"</span>");
        $("#d17_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason17+"</span>");
            }
            if($data.empDtr[$i].d17 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d17").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d17").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d17").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d17").html('<span class="text-danger">--:--</span>');
                $("#d17_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d17_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d17").html($data.empDtr[$i].AmArr_d17);
        $("#AmDep_d17").html($data.empDtr[$i].AmDep_d17);
        $("#PmArr_d17").html($data.empDtr[$i].PmArr_d17);
        $("#PmDep_d17").html($data.empDtr[$i].PmDep_d17);
        $("#d17_HUtime").html($data.empDtr[$i].d17_HUtime);
        $("#d17_MUtime").html($data.empDtr[$i].d17_MUtime);
            }

        //day18
      
      if ($data.empDtr[$i].absreason18 !=0){
        $("#AmArr_d18").html("<span class='text-danger'>"+$data.empDtr[$i].absreason18+"</span>");
        $("#AmDep_d18").html("<span class='text-danger'>"+$data.empDtr[$i].absreason18+"</span>");
        $("#PmArr_d18").html("<span class='text-danger'>"+$data.empDtr[$i].absreason18+"</span>");
        $("#PmDep_d18").html("<span class='text-danger'>"+$data.empDtr[$i].absreason18+"</span>");
        $("#d18_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason18+"</span>");
        $("#d18_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason18+"</span>");
            }
            if($data.empDtr[$i].d18 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d18").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d18").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d18").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d18").html('<span class="text-danger">--:--</span>');
                $("#d18_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d18_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d18").html($data.empDtr[$i].AmArr_d18);
        $("#AmDep_d18").html($data.empDtr[$i].AmDep_d18);
        $("#PmArr_d18").html($data.empDtr[$i].PmArr_d18);
        $("#PmDep_d18").html($data.empDtr[$i].PmDep_d18);
        $("#d18_HUtime").html($data.empDtr[$i].d18_HUtime);
        $("#d18_MUtime").html($data.empDtr[$i].d18_MUtime);
            }

        //day19
      
      if ($data.empDtr[$i].absreason19 !=0){
        $("#AmArr_d19").html("<span class='text-danger'>"+$data.empDtr[$i].absreason19+"</span>");
        $("#AmDep_d19").html("<span class='text-danger'>"+$data.empDtr[$i].absreason19+"</span>");
        $("#PmArr_d19").html("<span class='text-danger'>"+$data.empDtr[$i].absreason19+"</span>");
        $("#PmDep_d19").html("<span class='text-danger'>"+$data.empDtr[$i].absreason19+"</span>");
        $("#d19_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason19+"</span>");
        $("#d19_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason19+"</span>");
            }
            if($data.empDtr[$i].d19 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d19").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d19").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d19").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d19").html('<span class="text-danger">--:--</span>');
                $("#d19_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d19_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d19").html($data.empDtr[$i].AmArr_d19);
        $("#AmDep_d19").html($data.empDtr[$i].AmDep_d19);
        $("#PmArr_d19").html($data.empDtr[$i].PmArr_d19);
        $("#PmDep_d19").html($data.empDtr[$i].PmDep_d19);
        $("#d19_HUtime").html($data.empDtr[$i].d19_HUtime);
        $("#d19_MUtime").html($data.empDtr[$i].d19_MUtime);
            }

        //day20
      
      if ($data.empDtr[$i].absreason20 !=0){
        $("#AmArr_d20").html("<span class='text-danger'>"+$data.empDtr[$i].absreason20+"</span>");
        $("#AmDep_d20").html("<span class='text-danger'>"+$data.empDtr[$i].absreason20+"</span>");
        $("#PmArr_d20").html("<span class='text-danger'>"+$data.empDtr[$i].absreason20+"</span>");
        $("#PmDep_d20").html("<span class='text-danger'>"+$data.empDtr[$i].absreason20+"</span>");
        $("#d20_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason20+"</span>");
        $("#d20_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason20+"</span>");
            }
            if($data.empDtr[$i].d20 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d20").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d20").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d20").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d20").html('<span class="text-danger">--:--</span>');
                $("#d20_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d20_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d20").html($data.empDtr[$i].AmArr_d20);
        $("#AmDep_d20").html($data.empDtr[$i].AmDep_d20);
        $("#PmArr_d20").html($data.empDtr[$i].PmArr_d20);
        $("#PmDep_d20").html($data.empDtr[$i].PmDep_d20);
        $("#d20_HUtime").html($data.empDtr[$i].d20_HUtime);
        $("#d20_MUtime").html($data.empDtr[$i].d20_MUtime);
            }

        //day21
      
      if ($data.empDtr[$i].absreason21 !=0){
        $("#AmArr_d21").html("<span class='text-danger'>"+$data.empDtr[$i].absreason21+"</span>");
        $("#AmDep_d21").html("<span class='text-danger'>"+$data.empDtr[$i].absreason21+"</span>");
        $("#PmArr_d21").html("<span class='text-danger'>"+$data.empDtr[$i].absreason21+"</span>");
        $("#PmDep_d21").html("<span class='text-danger'>"+$data.empDtr[$i].absreason21+"</span>");
        $("#d21_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason21+"</span>");
        $("#d21_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason21+"</span>");
            }
            if($data.empDtr[$i].d21 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d21").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d21").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d21").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d21").html('<span class="text-danger">--:--</span>');
                $("#d21_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d21_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d21").html($data.empDtr[$i].AmArr_d21);
        $("#AmDep_d21").html($data.empDtr[$i].AmDep_d21);
        $("#PmArr_d21").html($data.empDtr[$i].PmArr_d21);
        $("#PmDep_d21").html($data.empDtr[$i].PmDep_d21);
        $("#d21_HUtime").html($data.empDtr[$i].d21_HUtime);
        $("#d21_MUtime").html($data.empDtr[$i].d21_MUtime);
            }

        //day22
      
      if ($data.empDtr[$i].absreason22 !=0){
        $("#AmArr_d22").html("<span class='text-danger'>"+$data.empDtr[$i].absreason22+"</span>");
        $("#AmDep_d22").html("<span class='text-danger'>"+$data.empDtr[$i].absreason22+"</span>");
        $("#PmArr_d22").html("<span class='text-danger'>"+$data.empDtr[$i].absreason22+"</span>");
        $("#PmDep_d22").html("<span class='text-danger'>"+$data.empDtr[$i].absreason22+"</span>");
        $("#d22_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason22+"</span>");
        $("#d22_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason22+"</span>");
            }
            if($data.empDtr[$i].d22 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d22").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d22").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d22").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d22").html('<span class="text-danger">--:--</span>');
                $("#d22_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d22_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d22").html($data.empDtr[$i].AmArr_d22);
        $("#AmDep_d22").html($data.empDtr[$i].AmDep_d22);
        $("#PmArr_d22").html($data.empDtr[$i].PmArr_d22);
        $("#PmDep_d22").html($data.empDtr[$i].PmDep_d22);
        $("#d22_HUtime").html($data.empDtr[$i].d22_HUtime);
        $("#d22_MUtime").html($data.empDtr[$i].d22_MUtime);
            }

        //day23
      
      if ($data.empDtr[$i].absreason23 !=0){
        $("#AmArr_d23").html("<span class='text-danger'>"+$data.empDtr[$i].absreason23+"</span>");
        $("#AmDep_d23").html("<span class='text-danger'>"+$data.empDtr[$i].absreason23+"</span>");
        $("#PmArr_d23").html("<span class='text-danger'>"+$data.empDtr[$i].absreason23+"</span>");
        $("#PmDep_d23").html("<span class='text-danger'>"+$data.empDtr[$i].absreason23+"</span>");
        $("#d23_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason23+"</span>");
        $("#d23_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason23+"</span>");
            }
            if($data.empDtr[$i].d23 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d23").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d23").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d23").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d23").html('<span class="text-danger">--:--</span>');
                $("#d23_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d23_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d23").html($data.empDtr[$i].AmArr_d23);
        $("#AmDep_d23").html($data.empDtr[$i].AmDep_d23);
        $("#PmArr_d23").html($data.empDtr[$i].PmArr_d23);
        $("#PmDep_d15").html($data.empDtr[$i].PmDep_d23);
        $("#d23_HUtime").html($data.empDtr[$i].d23_HUtime);
        $("#d23_MUtime").html($data.empDtr[$i].d23_MUtime);
            }

        //day24
      
      if ($data.empDtr[$i].absreason24 !=0){
        $("#AmArr_d24").html("<span class='text-danger'>"+$data.empDtr[$i].absreason24+"</span>");
        $("#AmDep_d24").html("<span class='text-danger'>"+$data.empDtr[$i].absreason24+"</span>");
        $("#PmArr_d24").html("<span class='text-danger'>"+$data.empDtr[$i].absreason24+"</span>");
        $("#PmDep_d24").html("<span class='text-danger'>"+$data.empDtr[$i].absreason24+"</span>");
        $("#d24_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason24+"</span>");
        $("#d24_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason24+"</span>");
            }
            if($data.empDtr[$i].d24 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d24").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d24").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d24").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d24").html('<span class="text-danger">--:--</span>');
                $("#d24_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d24_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d24").html($data.empDtr[$i].AmArr_d24);
        $("#AmDep_d24").html($data.empDtr[$i].AmDep_d24);
        $("#PmArr_d24").html($data.empDtr[$i].PmArr_d24);
        $("#PmDep_d24").html($data.empDtr[$i].PmDep_d24);
        $("#d24_HUtime").html($data.empDtr[$i].d24_HUtime);
        $("#d24_MUtime").html($data.empDtr[$i].d24_MUtime);
            }

        //day25
      
      if ($data.empDtr[$i].absreason25 !=0){
        $("#AmArr_d25").html("<span class='text-danger'>"+$data.empDtr[$i].absreason25+"</span>");
        $("#AmDep_d25").html("<span class='text-danger'>"+$data.empDtr[$i].absreason25+"</span>");
        $("#PmArr_d25").html("<span class='text-danger'>"+$data.empDtr[$i].absreason25+"</span>");
        $("#PmDep_d25").html("<span class='text-danger'>"+$data.empDtr[$i].absreason25+"</span>");
        $("#d25_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason25+"</span>");
        $("#d25_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason25+"</span>");
            }
            if($data.empDtr[$i].d25 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d25").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d25").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d25").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d25").html('<span class="text-danger">--:--</span>');
                $("#d25_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d25_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d25").html($data.empDtr[$i].AmArr_d25);
        $("#AmDep_d25").html($data.empDtr[$i].AmDep_d25);
        $("#PmArr_d25").html($data.empDtr[$i].PmArr_d25);
        $("#PmDep_d25").html($data.empDtr[$i].PmDep_d25);
        $("#d25_HUtime").html($data.empDtr[$i].d25_HUtime);
        $("#d25_MUtime").html($data.empDtr[$i].d25_MUtime);
            }

        //day26
      
      if ($data.empDtr[$i].absreason26 !=0){
        $("#AmArr_d26").html("<span class='text-danger'>"+$data.empDtr[$i].absreason26+"</span>");
        $("#AmDep_d26").html("<span class='text-danger'>"+$data.empDtr[$i].absreason26+"</span>");
        $("#PmArr_d26").html("<span class='text-danger'>"+$data.empDtr[$i].absreason26+"</span>");
        $("#PmDep_d26").html("<span class='text-danger'>"+$data.empDtr[$i].absreason26+"</span>");
        $("#d26_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason26+"</span>");
        $("#d26_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason26+"</span>");
            }
            if($data.empDtr[$i].d26 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d26").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d26").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d26").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d26").html('<span class="text-danger">--:--</span>');
                $("#d26_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d26_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d26").html($data.empDtr[$i].AmArr_d26);
        $("#AmDep_d26").html($data.empDtr[$i].AmDep_d26);
        $("#PmArr_d26").html($data.empDtr[$i].PmArr_d26);
        $("#PmDep_d26").html($data.empDtr[$i].PmDep_d26);
        $("#d26_HUtime").html($data.empDtr[$i].d26_HUtime);
        $("#d26_MUtime").html($data.empDtr[$i].d26_MUtime);
            }

        //day27
      
      if ($data.empDtr[$i].absreason27 !=0){
        $("#AmArr_d27").html("<span class='text-danger'>"+$data.empDtr[$i].absreason27+"</span>");
        $("#AmDep_d27").html("<span class='text-danger'>"+$data.empDtr[$i].absreason27+"</span>");
        $("#PmArr_d27").html("<span class='text-danger'>"+$data.empDtr[$i].absreason27+"</span>");
        $("#PmDep_d27").html("<span class='text-danger'>"+$data.empDtr[$i].absreason27+"</span>");
        $("#d27_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason27+"</span>");
        $("#d27_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason27+"</span>");
            }
            if($data.empDtr[$i].d27 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d27").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d27").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d27").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d27").html('<span class="text-danger">--:--</span>');
                $("#d27_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d27_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d27").html($data.empDtr[$i].AmArr_d27);
        $("#AmDep_d27").html($data.empDtr[$i].AmDep_d27);
        $("#PmArr_d27").html($data.empDtr[$i].PmArr_d27);
        $("#PmDep_d27").html($data.empDtr[$i].PmDep_d27);
        $("#d27_HUtime").html($data.empDtr[$i].d27_HUtime);
        $("#d27_MUtime").html($data.empDtr[$i].d27_MUtime);
            }

        //day28
      
      if ($data.empDtr[$i].absreason28 !=0){
        $("#AmArr_d28").html("<span class='text-danger'>"+$data.empDtr[$i].absreason28+"</span>");
        $("#AmDep_d28").html("<span class='text-danger'>"+$data.empDtr[$i].absreason28+"</span>");
        $("#PmArr_d28").html("<span class='text-danger'>"+$data.empDtr[$i].absreason28+"</span>");
        $("#PmDep_d28").html("<span class='text-danger'>"+$data.empDtr[$i].absreason28+"</span>");
        $("#d28_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason28+"</span>");
        $("#d28_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason28+"</span>");
            }
            if($data.empDtr[$i].d28 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d28").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d28").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d28").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d28").html('<span class="text-danger">--:--</span>');
                $("#d28_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d28_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d28").html($data.empDtr[$i].AmArr_d28);
        $("#AmDep_d28").html($data.empDtr[$i].AmDep_d28);
        $("#PmArr_d28").html($data.empDtr[$i].PmArr_d28);
        $("#PmDep_d28").html($data.empDtr[$i].PmDep_d28);
        $("#d28_HUtime").html($data.empDtr[$i].d28_HUtime);
        $("#d28_MUtime").html($data.empDtr[$i].d28_MUtime);
            }

        //day29
      
      if ($data.empDtr[$i].absreason29 !=0){
        $("#AmArr_d29").html("<span class='text-danger'>"+$data.empDtr[$i].absreason29+"</span>");
        $("#AmDep_d29").html("<span class='text-danger'>"+$data.empDtr[$i].absreason29+"</span>");
        $("#PmArr_d29").html("<span class='text-danger'>"+$data.empDtr[$i].absreason29+"</span>");
        $("#PmDep_d29").html("<span class='text-danger'>"+$data.empDtr[$i].absreason29+"</span>");
        $("#d29_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason29+"</span>");
        $("#d29_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason29+"</span>");
            }
            if($data.empDtr[$i].d29 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d29").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d29").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d29").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d29").html('<span class="text-danger">--:--</span>');
                $("#d29_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d29_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d29").html($data.empDtr[$i].AmArr_d29);
        $("#AmDep_d29").html($data.empDtr[$i].AmDep_d29);
        $("#PmArr_d29").html($data.empDtr[$i].PmArr_d29);
        $("#PmDep_d29").html($data.empDtr[$i].PmDep_d29);
        $("#d29_HUtime").html($data.empDtr[$i].d29_HUtime);
        $("#d29_MUtime").html($data.empDtr[$i].d29_MUtime);
            }

        //day30
      
      if ($data.empDtr[$i].absreason30 !=0){
        $("#AmArr_d30").html("<span class='text-danger'>"+$data.empDtr[$i].absreason30+"</span>");
        $("#AmDep_d30").html("<span class='text-danger'>"+$data.empDtr[$i].absreason30+"</span>");
        $("#PmArr_d30").html("<span class='text-danger'>"+$data.empDtr[$i].absreason30+"</span>");
        $("#PmDep_d30").html("<span class='text-danger'>"+$data.empDtr[$i].absreason30+"</span>");
        $("#d30_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason30+"</span>");
        $("#d30_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason30+"</span>");
            }
            if($data.empDtr[$i].d30 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d30").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d30").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d30").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d30").html('<span class="text-danger">--:--</span>');
                $("#d30_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d30_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d30").html($data.empDtr[$i].AmArr_d30);
        $("#AmDep_d30").html($data.empDtr[$i].AmDep_d30);
        $("#PmArr_d30").html($data.empDtr[$i].PmArr_d30);
        $("#PmDep_d30").html($data.empDtr[$i].PmDep_d30);
        $("#d30_HUtime").html($data.empDtr[$i].d30_HUtime);
        $("#d30_MUtime").html($data.empDtr[$i].d30_MUtime);
            }

        //day31
      
      if ($data.empDtr[$i].absreason31 !=0){
        $("#AmArr_d31").html("<span class='text-danger'>"+$data.empDtr[$i].absreason31+"</span>");
        $("#AmDep_d31").html("<span class='text-danger'>"+$data.empDtr[$i].absreason31+"</span>");
        $("#PmArr_d31").html("<span class='text-danger'>"+$data.empDtr[$i].absreason31+"</span>");
        $("#PmDep_d31").html("<span class='text-danger'>"+$data.empDtr[$i].absreason31+"</span>");
        $("#d31_HUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason31+"</span>");
        $("#d31_MUtime").html("<span class='text-danger'>"+$data.empDtr[$i].absreason31+"</span>");
            }
            if($data.empDtr[$i].d31 === "00:00 00:00 00:00 00:00"){
                $("#AmArr_d31").html('<span class="text-danger">--:--</span>');
                $("#AmDep_d31").html('<span class="text-danger">--:--</span>');
                $("#PmArr_d31").html('<span class="text-danger">--:--</span>');
                $("#PmDep_d31").html('<span class="text-danger">--:--</span>');
                $("#d31_HUtime").html('<span class="text-danger">--:--</span>');
                $("#d31_MUtime").html('<span class="text-danger">--:--</span>');
            }else{
        $("#AmArr_d31").html($data.empDtr[$i].AmArr_d31);
        $("#AmDep_d31").html($data.empDtr[$i].AmDep_d31);
        $("#PmArr_d31").html($data.empDtr[$i].PmArr_d31);
        $("#PmDep_d31").html($data.empDtr[$i].PmDep_d31);
        $("#d31_HUtime").html($data.empDtr[$i].d31_HUtime);
        $("#d31_MUtime").html($data.empDtr[$i].d31_MUtime);
            }
            return false;
      }
     
   
    });
   
    let getDayName = (dateString) =>new Intl.DateTimeFormat('en-Us', { weekday: 'short' }).format(new Date(dateString));

    $("#day1").html(getDayName($month+'/'+1+'/'+$year));
    $("#day2").html(getDayName($month+'/'+2+'/'+$year));
    $("#day3").html(getDayName($month+'/'+3+'/'+$year));
    $("#day4").html(getDayName($month+'/'+4+'/'+$year));
    $("#day5").html(getDayName($month+'/'+5+'/'+$year));
    $("#day6").html(getDayName($month+'/'+6+'/'+$year));
    $("#day7").html(getDayName($month+'/'+7+'/'+$year));
    $("#day8").html(getDayName($month+'/'+8+'/'+$year));
    $("#day9").html(getDayName($month+'/'+9+'/'+$year));
    $("#day10").html(getDayName($month+'/'+10+'/'+$year));
    $("#day11").html(getDayName($month+'/'+11+'/'+$year));
    $("#day12").html(getDayName($month+'/'+12+'/'+$year));
    $("#day13").html(getDayName($month+'/'+13+'/'+$year));
    $("#day14").html(getDayName($month+'/'+14+'/'+$year));
    $("#day15").html(getDayName($month+'/'+15+'/'+$year));
    $("#day16").html(getDayName($month+'/'+16+'/'+$year));
    $("#day17").html(getDayName($month+'/'+17+'/'+$year));
    $("#day18").html(getDayName($month+'/'+18+'/'+$year));
    $("#day19").html(getDayName($month+'/'+19+'/'+$year));
    $("#day20").html(getDayName($month+'/'+20+'/'+$year));
    $("#day21").html(getDayName($month+'/'+21+'/'+$year));
    $("#day22").html(getDayName($month+'/'+22+'/'+$year));
    $("#day23").html(getDayName($month+'/'+23+'/'+$year));
    $("#day24").html(getDayName($month+'/'+24+'/'+$year));
    $("#day25").html(getDayName($month+'/'+25+'/'+$year));
    $("#day26").html(getDayName($month+'/'+26+'/'+$year));
    $("#day27").html(getDayName($month+'/'+27+'/'+$year));
    $("#day28").html(getDayName($month+'/'+28+'/'+$year));
    $("#day29").html(getDayName($month+'/'+29+'/'+$year));
    $("#day30").html(getDayName($month+'/'+30+'/'+$year));
    $("#day31").html(getDayName($month+'/'+31+'/'+$year));
    return false;
});

function ClearDtrValue(){
    $("#AmArr_d1").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d1").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d1").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d1").html("<p class='text-danger'>--:--</p>");
    $("#d1_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d1_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d2").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d2").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d2").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d2").html("<p class='text-danger'>--:--</p>");
    $("#d2_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d2_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d3").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d3").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d3").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d3").html("<p class='text-danger'>--:--</p>");
    $("#d3_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d3_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d4").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d4").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d4").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d4").html("<p class='text-danger'>--:--</p>");
    $("#d4_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d4_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d5").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d5").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d5").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d5").html("<p class='text-danger'>--:--</p>");
    $("#d5_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d5_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d6").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d6").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d6").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d6").html("<p class='text-danger'>--:--</p>");
    $("#d6_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d6_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d7").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d7").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d7").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d7").html("<p class='text-danger'>--:--</p>");
    $("#d7_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d7_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d8").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d8").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d8").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d8").html("<p class='text-danger'>--:--</p>");
    $("#d8_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d8_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d9").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d9").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d9").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d9").html("<p class='text-danger'>--:--</p>");
    $("#d9_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d9_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d10").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d10").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d10").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d10").html("<p class='text-danger'>--:--</p>");
    $("#d10_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d10_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d11").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d11").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d11").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d11").html("<p class='text-danger'>--:--</p>");
    $("#d11_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d11_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d12").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d12").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d12").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d12").html("<p class='text-danger'>--:--</p>");
    $("#d12_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d12_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d13").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d13").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d13").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d13").html("<p class='text-danger'>--:--</p>");
    $("#d13_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d13_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d14").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d14").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d14").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d14").html("<p class='text-danger'>--:--</p>");
    $("#d14_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d14_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d15").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d15").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d15").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d15").html("<p class='text-danger'>--:--</p>");
    $("#d15_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d15_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d16").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d16").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d16").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d16").html("<p class='text-danger'>--:--</p>");
    $("#d16_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d16_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d17").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d17").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d17").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d17").html("<p class='text-danger'>--:--</p>");
    $("#d17_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d17_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d18").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d18").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d18").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d18").html("<p class='text-danger'>--:--</p>");
    $("#d18_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d18_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d19").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d19").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d19").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d19").html("<p class='text-danger'>--:--</p>");
    $("#d19_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d19_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d20").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d20").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d20").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d20").html("<p class='text-danger'>--:--</p>");
    $("#d20_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d20_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d21").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d21").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d21").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d21").html("<p class='text-danger'>--:--</p>");
    $("#d21_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d21_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d22").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d22").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d22").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d22").html("<p class='text-danger'>--:--</p>");
    $("#d22_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d22_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d23").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d23").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d23").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d23").html("<p class='text-danger'>--:--</p>");
    $("#d23_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d23_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d24").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d24").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d24").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d24").html("<p class='text-danger'>--:--</p>");
    $("#d24_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d24_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d25").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d25").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d25").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d25").html("<p class='text-danger'>--:--</p>");
    $("#d25_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d25_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d26").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d26").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d26").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d26").html("<p class='text-danger'>--:--</p>");
    $("#d26_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d26_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d27").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d27").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d27").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d27").html("<p class='text-danger'>--:--</p>");
    $("#d27_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d27_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d28").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d28").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d28").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d28").html("<p class='text-danger'>--:--</p>");
    $("#d28_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d28_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d29").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d29").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d29").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d29").html("<p class='text-danger'>--:--</p>");
    $("#d29_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d29_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d30").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d30").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d30").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d30").html("<p class='text-danger'>--:--</p>");
    $("#d30_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d30_MUtime").html("<p class='text-danger'>--:--</p>");

    $("#AmArr_d31").html("<p class='text-danger'>--:--</p>");
    $("#AmDep_d31").html("<p class='text-danger'>--:--</p>");
    $("#PmArr_d31").html("<p class='text-danger'>--:--</p>");
    $("#PmDep_d31").html("<p class='text-danger'>--:--</p>");
    $("#d31_HUtime").html("<p class='text-danger'>--:--</p>");
    $("#d31_MUtime").html("<p class='text-danger'>--:--</p>");
    return false; 
}

$("#btnDtrPrint").on('click', function (e) {
   
       $("#print-Dtrarea").print();    
   });