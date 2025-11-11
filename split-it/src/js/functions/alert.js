function showAlert({
  title         = '提示',
  text          = '',
  icon          = 'info',
  timer         = 1000,
  confirmButton = false,
  cancelButton  = false,
  willClose     = null
} = {}) {
  Swal.fire({
    title,
    text,
    icon,
    timer,
    timerProgressBar  : true,
    showConfirmButton : confirmButton,
    showCancelButton  : cancelButton,
    willClose: typeof willClose === 'function' ? willClose : undefined
  });
}

function showNotication({
  title     = '提示',
  text      = '1秒後自動關閉',
  willClose = null
} = {}) {
  showAlert({
    title: title,
    text,
    icon: 'warning',
    willClose
  });
}

function showError({
  title     = '操作失敗',
  text      = '1秒後自動關閉',
  willClose = null
} = {}) {
  showAlert({
    title: title,
    text,
    icon: 'error',
    willClose
  });
}

function showSuccess({
  title     = '操作成功',
  text      = '1秒後自動關閉',
  willClose = null
} = {}) {
  showAlert({
    title: title,
    text,
    icon: 'success',
    willClose
  });
}

function showConfirm({
  title = '注意',
  text  = '',
  then  = null
} = {}) {
  Swal.fire({
    title             : title,
    text              : text,
    icon              : 'warning',
    showDenyButton    : true,
    confirmButtonText : "確認",
    denyButtonText    : `取消`
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed && typeof then === 'function') {
      then(); // ✅ 執行傳入的 callback
    }
  });
}