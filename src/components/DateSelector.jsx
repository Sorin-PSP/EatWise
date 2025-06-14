import { format, addDays, subDays, parseISO } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa'

function DateSelector({ currentDate, setCurrentDate }) {
  const formattedDate = format(parseISO(currentDate), 'EEEE, MMMM d, yyyy', { locale: enUS })
  
  const goToPreviousDay = () => {
    const newDate = subDays(parseISO(currentDate), 1)
    setCurrentDate(format(newDate, 'yyyy-MM-dd'))
  }
  
  const goToNextDay = () => {
    const newDate = addDays(parseISO(currentDate), 1)
    setCurrentDate(format(newDate, 'yyyy-MM-dd'))
  }
  
  const goToToday = () => {
    setCurrentDate(format(new Date(), 'yyyy-MM-dd'))
  }
  
  return (
    <div className="flex items-center justify-between mb-6">
      <button 
        onClick={goToPreviousDay}
        className="p-2 rounded-full hover:bg-gray-200"
        aria-label="Previous day"
      >
        <FaChevronLeft />
      </button>
      
      <div className="flex items-center">
        <button 
          onClick={goToToday}
          className="flex items-center mr-2 text-primary hover:text-primary-dark"
        >
          <FaCalendarAlt className="mr-1" />
          <span className="text-sm">Today</span>
        </button>
        <h2 className="text-lg font-medium capitalize">{formattedDate}</h2>
      </div>
      
      <button 
        onClick={goToNextDay}
        className="p-2 rounded-full hover:bg-gray-200"
        aria-label="Next day"
      >
        <FaChevronRight />
      </button>
    </div>
  )
}

export default DateSelector
