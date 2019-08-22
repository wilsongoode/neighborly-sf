'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Organization extends Model {
    static get table () {
        return 'organizations'
      }
}

module.exports = Organization
