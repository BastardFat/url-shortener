function closeGeneralError() {
  $("#general-error").hide(1000);
}

function copy(id) {
  $("#"+id).select();
  document.execCommand("copy");
}
