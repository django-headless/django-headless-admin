import "dayjs/locale/nl";

import dayjs from "dayjs";
// Day.js plugins
import advancedFormat from "dayjs/plugin/advancedFormat";
import calendar from "dayjs/plugin/calendar";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayOfYear from "dayjs/plugin/dayOfYear";
import isBetween from "dayjs/plugin/isBetween";
import localeData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import utc from "dayjs/plugin/utc";

declare module "dayjs" {
  interface Dayjs {
    getCurrentTimeZone(): string;
  }
}

dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.extend(isBetween);
dayjs.extend(timezone);
dayjs.extend(updateLocale);
dayjs.extend(advancedFormat);
dayjs.extend(dayOfYear);

dayjs.updateLocale("en", {
  weekStart: 1,
});

const tz = dayjs.tz.guess();
dayjs.tz.setDefault(tz);
console.info(`Using ${tz} timezone`);

const getTimeZone = (option: any, dayjsClass: any) => {
  dayjsClass.prototype.getCurrentTimeZone = function () {
    return tz;
  };
};

dayjs.extend(getTimeZone);
