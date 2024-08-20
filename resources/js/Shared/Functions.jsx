/***
 * Date and Time Functions
 */

//Date/Time into UK locale.
export function DateTimeToUKLocale(date) {
    let localDate = new Date(date).toLocaleString('en-GB', {timeZone: "Europe/London"})
    return (
        localDate
    )
}

//Date only into UK locale.
export function DateToUKLocale(date) {
    let localDate = new Date(date).toLocaleDateString('en-GB', {timeZone: "Europe/London"})
    return (
        localDate
    )
}

//DateTime to UK Date
export function DateTimeToUKDate(date) {
    let localDate = new Date(date).toLocaleDateString('en-GB', {timeZone: "Europe/London"})
    return (
        localDate
    )
}

//Time only into UK local
export function TimeToUKLocale(date) {
    let timeOptions = { hour: '2-digit', minute: '2-digit' }
    let time = new Date(date).toLocaleTimeString('en-GB', timeOptions)
    return (
        time
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

//Get number of months when using month picker
export function NumberOfMonths(m1,m2) {
    if(!m2) {
        return 1
    } else {
        let months
        months = (m2.getFullYear() - m1.getFullYear()) * 12
        months -= m1.getMonth()
        months += m2.getMonth()
        return months <= 0 ? 1 : months + 1
    }
}

//Get first day of the month
export function FirstDayOfTheMonth() {
    let date = new Date();
    date.setDate(1)
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    return date
}

export function LastDayOfTheMonth(date) {
    let day = date ?? new Date()
    return new Date(day.getFullYear(), day.getMonth()+1, 0);
}

/***
 * Notifcations
 */
export function SuccessNotificationSettings(status, message, theme) {
    return ({
        title: status,
        message: message,
        autoClose: 2000,
        color: 'green',
        style: { backgroundColor: '#c7d99b' },
        sx: { backgroundColor: '#c7d99b' },
        styles: (theme) => ({
            title: { color: theme.black },
            description: { color: theme.black },
            closeButton: {
                color: theme.black
            }
        })
    })
}
