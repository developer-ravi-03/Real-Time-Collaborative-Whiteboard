export function socketSuccess(callback, data = {}) {
  callback({
    success: true,
    ...data,
  });
}

export function socketError(callback, error) {
  callback({
    success: false,
    message: error.message,
  });
}
