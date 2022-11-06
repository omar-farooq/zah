//Date/Time into UK locale.
export function DateTimeToUKLocale(date) {
    let localDate = new Date(date).toLocaleString('en-GB')
    return (
        localDate
    )
}

//Long date format example: Friday, 11 November 2022
export function LongDateFormat(date) {
    let options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    let longDate = new Date(date).toLocaleString('en-GB', options)
    return (
        longDate
    )
}

//Long time format example: Friday, 11 November 2022 18:30
export function LongDateTimeFormat(date) {
    let dateOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    let longDate = new Date(date).toLocaleString('en-GB', dateOptions)

    let timeOptions = { hour: '2-digit', minute: '2-digit' }
    let longTime = new Date(date).toLocaleTimeString('en-GB', timeOptions)
    return (
        longDate + " " + longTime
    )
}

