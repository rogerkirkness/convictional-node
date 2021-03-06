var request = require('request')
var lib = require('./functions.js')

class Convictional {
  constructor(options) {
    var getApiKey = () => {
      if (options.apiKey) {
        return options.apiKey
      }
    }
    var getApiUrl = () => {
      if (options.apiUrl) {
        return options.apiUrl
      } else {
        return 'https://api.convictional.com'
      }
    }
    var getAdminKey = () => {
      if (options.adminKey) {
        return options.adminKey
      }
    }
    this.getOrder = (id, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!id) { err = 'No ID provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/orders/' + id,
          headers: { 'Authorization': apiKey },
          method: 'GET'
        }, lib.requestHandler(reject, (res, body) => {
            resolve(JSON.parse(body))
        }))
      })
    }
    this.getOrders = (query, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!query) { err = 'No query provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/orders' + lib.convertParams(query),
          headers: { 'Authorization': apiKey },
          method: 'GET'
        }, lib.requestHandler(reject, (res, body) => {
            resolve(JSON.parse(body))
        }))
      })
    }
    this.postOrder = (record, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!record) { err = 'No record provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/orders',
          headers: { 'Authorization': apiKey },
          method: 'POST',
          json: record
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.putOrder = (record, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!record) { err = 'No record provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/orders/' + record._id,
          headers: { 'Authorization': apiKey },
          method: 'PUT',
          json: record
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.putOrders = (records, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var recordLength = records.length
        var err
        if (!records) { err = 'No records provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        if (recordLength >= 100) {
          var count = Math.ceil(recordLength / 100)
          var putOrders = (i) => {
            if (i > 0) {
              request({
                url: apiUrl + '/orders',
                headers: { 'Authorization': apiKey },
                method: 'PUT',
                json: records.splice(0, lib.getSpliceLength(records.length))
              }, lib.requestHandler(reject, (res, body) => {
                  return putOrders(i - 1)
              }))
            } else {
              resolve({ 'updated': recordLength })
            }
          }
          putOrders(count)
        } else {
          request({
            url: apiUrl + '/orders',
            headers: { 'Authorization': apiKey },
            method: 'PUT',
            json: records
          }, lib.requestHandler(reject, (res, body) => {
              resolve(body)
          }))
        }
      })
    }
    this.deleteOrder = (id, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!id) { err = 'No ID provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/orders/' + id,
          headers: { 'Authorization': apiKey },
          method: 'DELETE'
        }, lib.requestHandler(reject, (res, body) => {
            resolve(JSON.parse(body))
        }))
      })
    }
    this.billOrder = (orderId, parentId, customerEmail, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!orderId) { err = 'No Order ID provided.'; reject(err) }
        if (!parentId) { err = 'No User ID provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/handlers/stripe/billOrder',
          method: 'POST',
          headers: { 'Authorization': apiKey },
          json: {
            'orderId': orderId,
            'parentId': parentId,
            'customerEmail': customerEmail
          }
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.refundOrder = (orderId, userId, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!orderId) { err = 'No Order ID provided.'; reject(err) }
        if (!userId) { err = 'No User ID provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/handlers/stripe/refundOrder',
          method: 'POST',
          headers: { 'Authorization': apiKey },
          json: {
            'orderId': orderId,
            'userId': userId
          }
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.quickOrder = (order, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!order) { err = 'No Order provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/handlers/emails/quickOrder',
          method: 'POST',
          headers: { 'Authorization': apiKey },
          json: order
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.getProduct = (id, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!id) { err = 'No ID provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/products/' + id,
          headers: { 'Authorization': apiKey },
          method: 'GET'
        }, lib.requestHandler(reject, (res, body) => {
            resolve(JSON.parse(body))
        }))
      })
    }
    this.getProducts = (query, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!query) { err = 'No query provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/products' + lib.convertParams(query),
          headers: { 'Authorization': apiKey },
          method: 'GET'
        }, lib.requestHandler(reject, (res, body) => {
            resolve(JSON.parse(body))
        }))
      })
    }
    this.postProduct = (record, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!record) { err = 'No record provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/products',
          headers: { 'Authorization': apiKey },
          method: 'POST',
          json: record
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.putProduct = (record, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!record) { err = 'No record provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/products/' + record._id,
          headers: { 'Authorization': apiKey },
          method: 'PUT',
          json: record
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.putProducts = (records, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!records) { err = 'No records provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        var recordLength = records.length
        if (recordLength >= 100) {
          var count = Math.ceil(recordLength / 100)
          var putProducts = (i) => {
            if (i > 0) {
              request({
                url: apiUrl + '/products',
                headers: { 'Authorization': apiKey },
                method: 'PUT',
                json: records.splice(0, lib.getSpliceLength(records.length))
              }, lib.requestHandler(reject, (res, body) => {
                  return putProducts(i - 1)
              }))
            } else {
              resolve({ 'updated': recordLength })
            }
          }
          putProducts(count)
        } else {
          request({
            url: apiUrl + '/products',
            headers: { 'Authorization': apiKey },
            method: 'PUT',
            json: records
          }, lib.requestHandler(reject, (res, body) => {
              resolve(body)
          }))
        }
      })
    }
    this.deleteProduct = (id, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!id) { err = 'No ID provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/products/' + id,
          headers: { 'Authorization': apiKey },
          method: 'DELETE'
        }, lib.requestHandler(reject, (res, body) => {
            resolve(JSON.parse(body))
        }))
      })
    }
    this.getPartner = (id, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!id) { err = 'No ID provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/partners/' + id,
          headers: { 'Authorization': apiKey },
          method: 'GET'
        }, lib.requestHandler(reject, (res, body) => {
            resolve(JSON.parse(body))
        }))
      })
    }
    this.getPartners = (query, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!query) { err = 'No query provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/partners' + lib.convertParams(query),
          headers: { 'Authorization': apiKey },
          method: 'GET'
        }, lib.requestHandler(reject, (res, body) => {
            resolve(JSON.parse(body))
        }))
      })
    }
    this.postPartner = (record, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!record) { err = 'No record provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/partners',
          headers: { 'Authorization': apiKey },
          method: 'POST',
          json: record
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.putPartner = (record, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!record) { err = 'No record provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/partners/' + record._id,
          headers: { 'Authorization': apiKey },
          method: 'PUT',
          json: record
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.putPartners = (records, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!records) { err = 'No records provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        var recordLength = records.length
        if (recordLength >= 100) {
          var count = Math.ceil(recordLength / 100)
          var putPartners = (i) => {
            if (i > 0) {
              request({
                url: apiUrl + '/partners',
                headers: { 'Authorization': apiKey },
                method: 'PUT',
                json: records.splice(0, lib.getSpliceLength(records.length))
              }, lib.requestHandler(reject, (res, body) => {
                  return putPartners(i - 1)
              }))
            } else {
              resolve({ 'updated': recordLength })
            }
          }
          putPartners(count)
        } else {
          request({
            url: apiUrl + '/partners',
            headers: { 'Authorization': apiKey },
            method: 'PUT',
            json: records
          }, lib.requestHandler(reject, (res, body) => {
              resolve(body)
          }))
        }
      })
    }
    this.deletePartner = (id, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!id) { err = 'No ID provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/partners/' + id,
          headers: { 'Authorization': apiKey },
          method: 'DELETE'
        }, lib.requestHandler(reject, (res, body) => {
            resolve(JSON.parse(body))
        }))
      })
    }
    this.invitePartner = (partner, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!partner) { err = 'No partner provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/partners/invite',
          headers: { 'Authorization': apiKey },
          method: 'POST',
          json: partner
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.getPrice = (id, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!id) { err = 'No ID provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/prices/' + id,
          headers: { 'Authorization': apiKey },
          method: 'GET'
        }, lib.requestHandler(reject, (res, body) => {
            resolve(JSON.parse(body))
        }))
      })
    }
    this.getPrices = (query, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!query) { err = 'No query provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { var error = 'No API key provided.'; reject(error) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/prices' + lib.convertParams(query),
          headers: { 'Authorization': apiKey },
          method: 'GET'
        }, lib.requestHandler(reject, (res, body) => {
            resolve(JSON.parse(body))
        }))
      })
    }
    this.postPrice = (record, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!record) { err = 'No record provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/prices',
          headers: { 'Authorization': apiKey },
          method: 'POST',
          json: record
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.putPrice = (record, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!record) { err = 'No record provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/prices/' + record._id,
          headers: { 'Authorization': apiKey },
          method: 'PUT',
          json: record
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.putPrices = (records, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!records) { err = 'No records provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        var recordLength = records.length
        if (recordLength >= 100) {
          var count = Math.ceil(recordLength / 100)
          var putPrices = (i) => {
            if (i > 0) {
              request({
                url: apiUrl + '/prices',
                headers: { 'Authorization': apiKey },
                method: 'PUT',
                json: records.splice(0, lib.getSpliceLength(records.length))
              }, lib.requestHandler(reject, (res, body) => {
                  return putPrices(i - 1)
              }))
            } else {
              resolve({ 'updated': recordLength })
            }
          }
          putPrices(count)
        } else {
          request({
            url: apiUrl + '/prices',
            headers: { 'Authorization': apiKey },
            method: 'PUT',
            json: records
          }, lib.requestHandler(reject, (res, body) => {
              resolve(body)
          }))
        }
      })
    }
    this.deletePrice = (id, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!id) { err = 'No ID provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/prices/' + id,
          headers: { 'Authorization': apiKey },
          method: 'DELETE'
        }, lib.requestHandler(reject, (res, body) => {
            resolve(JSON.parse(body))
        }))
      })
    }
    this.getLog = (id, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!id) { err = 'No ID provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/logs/' + id,
          headers: { 'Authorization': apiKey },
          method: 'GET'
        }, lib.requestHandler(reject, (res, body) => {
            resolve(JSON.parse(body))
        }))
      })
    }
    this.getLogs = (query, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!query) { err = 'No query provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/logs' + lib.convertParams(query),
          headers: { 'Authorization': apiKey },
          method: 'GET'
        }, lib.requestHandler(reject, (res, body) => {
            resolve(JSON.parse(body))
        }))
      })
    }
    this.postLog = (record, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!record) { err = 'No record provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/logs',
          headers: { 'Authorization': apiKey },
          method: 'POST',
          json: record
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.putLog = (record, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!record) { err = 'No record provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/logs/' + record._id,
          headers: { 'Authorization': apiKey },
          method: 'PUT',
          json: record
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.putLogs = (records, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!records) { err = 'No records provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        var recordLength = records.length
        if (recordLength >= 100) {
          var count = Math.ceil(recordLength / 100)
          var putLogs = (i) => {
            if (i > 0) {
              request({
                url: apiUrl + '/logs',
                headers: { 'Authorization': apiKey },
                method: 'PUT',
                json: records.splice(0, lib.getSpliceLength(records.length))
              }, lib.requestHandler(reject, (res, body) => {
                  return putLogs(i - 1)
              }))
            } else {
              resolve({ 'updated': recordLength })
            }
          }
          putLogs(count)
        } else {
          request({
            url: apiUrl + '/logs',
            headers: { 'Authorization': apiKey },
            method: 'PUT',
            json: records
          }, lib.requestHandler(reject, (res, body) => {
              resolve(body)
          }))
        }
      })
    }
    this.deleteLog = (id, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!id) { err = 'No ID provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/logs/' + id,
          headers: { 'Authorization': apiKey },
          method: 'DELETE'
        }, lib.requestHandler(reject, (res, body) => {
            resolve(JSON.parse(body))
        }))
      })
    }
    this.getUser = (id, adminKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!id) { err = 'No ID provided.'; reject(err) }
        if (!adminKey) { adminKey = getAdminKey() }
        if (!adminKey) { err = 'No admin key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/users/' + id,
          headers: { 'Authorization': adminKey },
          method: 'GET'
        }, lib.requestHandler(reject, (res, body) => {
            resolve(JSON.parse(body))
        }))
      })
    }
    this.getUsers = (query, adminKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!query) { err = 'No query provided.'; reject(err) }
        if (!adminKey) { adminKey = getAdminKey() }
        if (!adminKey) { err = 'No admin key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/users' + lib.convertParams(query),
          headers: { 'Authorization': adminKey },
          method: 'GET'
        }, lib.requestHandler(reject, (res, body) => {
            resolve(JSON.parse(body))
        }))
      })
    }
    this.postUser = (record, adminKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!record) { err = 'No record provided.'; reject(err) }
        if (!adminKey) { adminKey = getAdminKey() }
        if (!adminKey) { err = 'No admin key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/users',
          headers: { 'Authorization': adminKey },
          method: 'POST',
          json: record
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.putUser = (record, adminKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!record) { err = 'No record provided.'; reject(err) }
        if (!adminKey) { adminKey = getAdminKey() }
        if (!adminKey) { err = 'No admin key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/users/' + record._id,
          headers: { 'Authorization': adminKey },
          method: 'PUT',
          json: record
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.putUsers = (records, adminKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!records) { err = 'No records provided.'; reject(err) }
        if (!adminKey) { adminKey = getAdminKey() }
        if (!adminKey) { err = 'No admin key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        var recordLength = records.length
        if (recordLength >= 100) {
          var count = Math.ceil(recordLength / 100)
          var putUsers = (i) => {
            if (i > 0) {
              request({
                url: apiUrl + '/users',
                headers: { 'Authorization': adminKey },
                method: 'PUT',
                json: records.splice(0, lib.getSpliceLength(records.length))
              }, lib.requestHandler(reject, (res, body) => {
                  return putUsers(i - 1)
              }))
            } else {
              resolve({ 'updated': recordLength })
            }
          }
          putUsers(count)
        } else {
          request({
            url: apiUrl + '/users',
            headers: { 'Authorization': adminKey },
            method: 'PUT',
            json: records
          }, lib.requestHandler(reject, (res, body) => {
              resolve(body)
          }))
        }
      })
    }
    this.deleteUser = (id, adminKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!id) { err = 'No ID provided.'; reject(err) }
        if (!adminKey) { adminKey = getAdminKey() }
        if (!adminKey) { err = 'No admin key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/users/' + id,
          headers: { 'Authorization': adminKey },
          method: 'DELETE'
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.offboardUser = (user, adminKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!user) { err = 'No user provided.'; reject(err) }
        if (!adminKey) { adminKey = getAdminKey() }
        if (!adminKey) { err = 'No admin key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/users/offboard',
          headers: { 'Authorization': adminKey },
          method: 'POST',
          json: user
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.onboardUser = (user, adminKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!user) { err = 'No user provided.'; reject(err) }
        if (!adminKey) { adminKey = getAdminKey() }
        if (!adminKey) { err = 'No admin key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/users/onboard',
          headers: { 'Authorization': adminKey },
          method: 'POST',
          json: user
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.sync = (method, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!method) { err = 'No method provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/workers/' + method,
          headers: { 'Authorization': apiKey },
          method: 'POST'
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.runWorker = (method, companyId, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!method) { err = 'No method provided.'; reject(err) }
        if (!companyId) { err = 'No companyId provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/workers/' + method,
          headers: { 'Authorization': apiKey },
          method: 'POST',
          json: { 'companyId': companyId }
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.translate = (doc, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!doc) { err = 'No document provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/translate',
          headers: { 'Authorization': apiKey, 'Content-Type': 'text/plain' },
          method: 'POST',
          body: doc
        }, lib.requestHandler(reject, (res, body) => {
            resolve(JSON.parse(body))
        }))
      })
    }
    this.unsubscribe = (email, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!email) { err = 'No email provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          uri: apiUrl + '/handlers/hubspot/unsubscribe/' + email,
          method: 'GET'
        }, lib.requestHandler(reject, (res, body) => {
            resolve(body)
        }))
      })
    }
    this.getCatalog = (email, apiKey, apiUrl) => {
      return new Promise((resolve, reject) => {
        var err
        if (!email) { err = 'No email provided.'; reject(err) }
        if (!apiKey) { apiKey = getApiKey() }
        if (!apiKey) { err = 'No API key provided.'; reject(err) }
        if (!apiUrl) { apiUrl = getApiUrl() }
        request({
          url: apiUrl + '/catalogs?email=' + email,
          headers: { 'Authorization': apiKey },
          method: 'GET',
        }, lib.requestHandler(reject, (res, body) => {
            resolve(JSON.parse(body))
        }))
      })
    }
  }
}

function init(options) {
  return new Convictional(options)
}

module.exports = init
