//Date/Time conversion from UTC in the database
export function DateTimeToUKLocale(date) {
    let localDate = new Date(date).toLocaleString('en-GB')
    return (
        localDate
    )
}
