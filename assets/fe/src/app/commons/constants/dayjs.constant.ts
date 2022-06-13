import dayjs from "dayjs";

// https://day.js.org/docs/en/parse/string-format
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import calendar from "dayjs/plugin/calendar";
import { enShortLocale } from "./dayjs.locale";

// Add plugin if necessary
dayjs.extend(relativeTime)
dayjs.extend(updateLocale)
dayjs.extend(calendar)

// add short time format in time ago
dayjs.locale('en-short',enShortLocale,true)

export default dayjs;