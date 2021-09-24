export function notifyFail(that, msg) {
  that.$notify({
    title: '提示',
    message: msg,
    type: 'error',
    duration: 2000
  });
}

export function notifySuccess(that, msg) {
  that.$notify({
    title: '提示',
    message: msg,
    type: 'success',
    duration: 2000
  });
}
