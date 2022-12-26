export const useDate = () => {

  function getDateText(date: string) {
    return new Date(date).toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
  }

  function getDayAndMonth(date: string) {
    return new Date(date).toLocaleString('fr-FR', { day: 'numeric', month: 'long' })
  }

  return { getDateText, getDayAndMonth }
}


