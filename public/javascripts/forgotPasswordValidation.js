$('#forgotPasswordForm').bootstrapValidator({
    message: '',
    fields: {
      password: {
          validators: {
              identical: {
                  field: 'confirmPassword'
                  //message: ''
              }
          }
      },
      rePassword: {
          validators: {
              identical: {
                  field: 'password',
                  message: 'Password Text Fields are not the same'
              }
          }
      }
  }
    });
