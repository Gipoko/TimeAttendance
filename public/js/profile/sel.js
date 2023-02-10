function fetchMe(url) {
  return $.ajax({
      url: url,
      method: 'post'
});
}

function select2SetValidation($sel2Obj) {
  $sel2Obj.on('select2:select', function (e) {
    $(this).valid();
  });
}

function select2SetInit($selObj, $objParent, $aData){
  $selObj.select2({
    dropdownParent: $($objParent),
    minimumResultsForSearch: -1,
    width: '100%',
    data: $aData
  });
}