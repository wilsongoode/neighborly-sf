'use strict'

class Register {
  get rules () {
    return {
      username: 'required|min:5|unique:users',
      email: 'required|email|unique:users',
      password: 'required|min:5|confirmed',
    }
  }

  get messages () {
    return {
      'username.required': 'The username field is required',
      'username.min': 'The username field must be at least 5 characters',
      'username.unique': 'That username already exists',
      'email.required': 'The email field is required',
      'email.email': 'Enter a valid email address',
      'email.unique': 'Email already exists',
      'password.required': 'The password field is required',
      'password.min': 'The password field must be at least 5 characters',
      'password.confirmed': 'The password fields do not match',
    }
  }
}

module.exports = Register
