
module.exports.validateBody = (schema) => (req,res,next) => {
const {error, value} = schema.validate(req.body, {convert: true, abortEarly: false})
if(error) {
    return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map(({message, path}) => ({message, path})),
    })
}
req.body = value
next()
}

module.exports.validateQueryParams = (schema) => (req,res,next) => {
const {error, value} = schema.validate(req.query, {convert: true, abortEarly: false})
if(error) {
    return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map(({message, path}) => ({message, path})),
    })
}
req.query = value
next()
}

module.exports.validateReqParams = (schema) => (req,res,next) => {
const {error, value} = schema.validate(req.params, {convert: true, abortEarly: false})
if(error) {
    return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map(({message, path}) => ({message, path})),
    })
}
req.params = value
next()
}

