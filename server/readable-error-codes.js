import status from 'statuses'

/**
 * @property {100} continue
 * @property {101} switching_protocols
 * @property {102} processing
 * @property {103} early_hints
 * @property {200} ok
 * @property {201} created
 * @property {202} accepted
 * @property {203} non_authoritative_information
 * @property {204} no_content
 * @property {205} reset_content
 * @property {206} partial_content
 * @property {207} multi_status
 * @property {208} already_reported
 * @property {226} im_used
 * @property {300} multiple_choices
 * @property {301} moved_permanently
 * @property {302} found
 * @property {303} see_other
 * @property {304} not_modified
 * @property {305} use_proxy
 * @property {307} temporary_redirect
 * @property {308} permanent_redirect
 * @property {400} bad_request
 * @property {401} unauthorized
 * @property {402} payment_required
 * @property {403} forbidden
 * @property {404} not_found
 * @property {405} method_not_allowed
 * @property {406} not_acceptable
 * @property {407} proxy_authentication_required
 * @property {408} request_timeout
 * @property {409} conflict
 * @property {410} gone
 * @property {411} length_required
 * @property {412} precondition_failed
 * @property {413} payload_too_large
 * @property {414} uri_too_long
 * @property {415} unsupported_media_type
 * @property {416} range_not_satisfiable
 * @property {417} expectation_failed
 * @property {418} im_a_teapot
 * @property {421} misdirected_request
 * @property {422} unprocessable_entity
 * @property {423} locked
 * @property {424} failed_dependency
 * @property {425} too_early
 * @property {426} upgrade_required
 * @property {428} precondition_required
 * @property {429} too_many_requests
 * @property {431} request_header_fields_too_large
 * @property {451} unavailable_for_legal_reasons
 * @property {500} internal_server_error
 * @property {501} not_implemented
 * @property {502} bad_gateway
 * @property {503} service_unavailable
 * @property {504} gateway_timeout
 * @property {505} http_version_not_supported
 * @property {506} variant_also_negotiates
 * @property {507} insufficient_storage
 * @property {508} loop_detected
 * @property {509} bandwidth_limit_exceeded
 * @property {510} not_extended
 * @property {511} network_authentication_required
 * */
const readableStatusCodes = {}

const codes = status.message
Object.keys(codes).forEach(code => {
    const message = codes[code]
    readableStatusCodes[message.toLowerCase()
        .replace(/[\s-]+/g, '_')
        .replace(/'/, '')] = Number(code)
})

export default readableStatusCodes
