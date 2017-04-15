import moment from 'moment'

export const checkDate = (date) => {
  return moment(date, moment.ISO_8601, true).isValid()
}