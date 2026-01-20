import { formatDate } from "@/utils/date/formatDate";
import { DATE_LABELS } from "../../constants/dateFormats";

describe("format Date", () => {

  it("should formate the date to a string: 'about ${value} {unit} ago'", () => {
    const date = new Date();

    type MinusDates = {
      year: string;
      month: string;
      weeks: string,
      day: string;
      hour: string;
      minute: string;
      seconds: string;
    };

    // Substract some values by one to ensure f.e: 1 day and not "days" return
    const minusDatesByOne: MinusDates = {
      year: new Date(new Date(date).setFullYear(date.getFullYear() - 1)).toISOString(),
      month: new Date(new Date(date).setMonth(date.getMonth() - 1)).toISOString(),
      weeks: new Date(new Date(date).setDate(date.getDate() - 7)).toISOString(),
      day: new Date(new Date(date).setDate(date.getDate() - 1)).toISOString(),
      hour: new Date(new Date(date).setHours(date.getHours() - 1)).toISOString(),
      minute: new Date(new Date(date).setMinutes(date.getMinutes() - 1)).toISOString(),
      seconds: new Date(new Date(date).setSeconds(date.getSeconds() - 1)).toISOString(),
    };

      // Substract some values by one to ensure f.e: i>1 days and not "day" return
    const minusDatesByMore: MinusDates = {
      year: new Date(new Date(date).setFullYear(date.getFullYear() - 4)).toISOString(),
      month: new Date(new Date(date).setMonth(date.getMonth() - 4)).toISOString(),
      weeks: new Date(new Date(date).setDate(date.getDate() - 21)).toISOString(),
      day: new Date(new Date(date).setDate(date.getDate() - 3)).toISOString(),
      hour: new Date(new Date(date).setHours(date.getHours() - 5)).toISOString(),
      minute: new Date(new Date(date).setMinutes(date.getMinutes() - 2)).toISOString(),
      seconds: new Date(new Date(date).setSeconds(date.getSeconds() - 5)).toISOString(),
    };

    const keys = Object.keys(DATE_LABELS);

    for (const array of [minusDatesByOne, minusDatesByMore]) {
      for (const value of Object.values(array)) {
        const formattedDate = formatDate(value);
        expect(keys.some(key =>
          formattedDate.includes(key)
        ))
      }
    }

  })

})