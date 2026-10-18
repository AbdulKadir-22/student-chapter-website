/**
 * Time utility for Indian Standard Time (+05:30)
 * IST offset in milliseconds: 5 hours 30 minutes = 330 minutes = 19,800,000 ms
 */

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

/**
 * Returns the current date/time shifted to IST representation
 * @param {Date|number} [date=new Date()]
 * @returns {Date}
 */
const getISTDate = (date = new Date()) => {
  const d = new Date(date);
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  return new Date(utc + IST_OFFSET_MS);
};

/**
 * Build UTC Date object from an IST date string (YYYY-MM-DD) and time string (HH:mm)
 * Example: '2025-09-24', '10:00' -> UTC Date representing 2025-09-24 10:00:00+05:30
 * @param {string} dateStr 'YYYY-MM-DD'
 * @param {string} timeStr 'HH:mm'
 * @returns {Date}
 */
const buildISTDateTime = (dateStr, timeStr) => {
  const isoStr = `${dateStr}T${timeStr}:00+05:30`;
  const parsed = new Date(isoStr);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid date/time format: ${dateStr} ${timeStr}`);
  }
  return parsed;
};

/**
 * Formats a Date to IST date string 'YYYY-MM-DD'
 * @param {Date} date
 * @returns {string}
 */
const formatISTDateString = (date) => {
  const ist = getISTDate(date);
  const year = ist.getFullYear();
  const month = String(ist.getMonth() + 1).padStart(2, '0');
  const day = String(ist.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Check if a date is "today" in IST
 * @param {Date} date
 * @returns {boolean}
 */
const isTodayIST = (date) => {
  if (!date) return false;
  const todayStr = formatISTDateString(new Date());
  const dateStr = formatISTDateString(date);
  return todayStr === dateStr;
};

/**
 * Returns UTC Date representing start of current month in IST (e.g. 2025-04-01T00:00:00+05:30)
 * @param {Date} [now=new Date()]
 * @returns {Date}
 */
const startOfMonthIST = (now = new Date()) => {
  const ist = getISTDate(now);
  const year = ist.getFullYear();
  const month = String(ist.getMonth() + 1).padStart(2, '0');
  return buildISTDateTime(`${year}-${month}-01`, '00:00');
};

/**
 * Returns UTC Date representing start of previous month in IST
 * @param {Date} [now=new Date()]
 * @returns {Date}
 */
const startOfPreviousMonthIST = (now = new Date()) => {
  const ist = getISTDate(now);
  let year = ist.getFullYear();
  let month = ist.getMonth(); // 0-indexed: current month - 1
  if (month === 0) {
    month = 12;
    year -= 1;
  }
  const monthStr = String(month).padStart(2, '0');
  return buildISTDateTime(`${year}-${monthStr}-01`, '00:00');
};

/**
 * Returns UTC Date representing start of semester in IST
 * Semesters: Jan-Jun (starts Jan 1) and Jul-Dec (starts Jul 1)
 * @param {Date} [now=new Date()]
 * @returns {Date}
 */
const startOfSemesterIST = (now = new Date()) => {
  const ist = getISTDate(now);
  const year = ist.getFullYear();
  const month = ist.getMonth() + 1; // 1-12
  const startMonth = month <= 6 ? '01' : '07';
  return buildISTDateTime(`${year}-${startMonth}-01`, '00:00');
};

/**
 * Returns UTC Date representing start of previous semester in IST
 * @param {Date} [now=new Date()]
 * @returns {Date}
 */
const startOfPreviousSemesterIST = (now = new Date()) => {
  const ist = getISTDate(now);
  let year = ist.getFullYear();
  const month = ist.getMonth() + 1; // 1-12
  let startMonth;
  if (month <= 6) {
    // Current is Jan-Jun, previous was Jul-Dec of last year
    year -= 1;
    startMonth = '07';
  } else {
    // Current is Jul-Dec, previous was Jan-Jun of this year
    startMonth = '01';
  }
  return buildISTDateTime(`${year}-${startMonth}-01`, '00:00');
};

/**
 * Format a Date for IST display in 12-hour format e.g. "10:05 AM"
 * @param {Date} date
 * @returns {string}
 */
const formatISTTime = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
};

/**
 * Format a Date for IST display e.g. "24 Sep 2025"
 * @param {Date} date
 * @returns {string}
 */
const formatISTDisplayDate = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

module.exports = {
  getISTDate,
  buildISTDateTime,
  formatISTDateString,
  isTodayIST,
  startOfMonthIST,
  startOfPreviousMonthIST,
  startOfSemesterIST,
  startOfPreviousSemesterIST,
  formatISTTime,
  formatISTDisplayDate,
};
