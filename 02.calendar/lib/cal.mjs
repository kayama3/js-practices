import { DateTime } from "luxon";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

function exec(argv) {
  const time = createTime(argv);
  const days = formatDays(time);

  putsTop(time);
  putsBody(days);
}

function createTime(argv) {
  const now_year = DateTime.now().year;
  const now_month = DateTime.now().month;
  const year = argv.y == undefined ? now_year : argv.y;
  const month = argv.m == undefined ? now_month : argv.m;
  return DateTime.local(year, month);
}

function formatDays(time) {
  const days = [];
  const first_of_month = time.startOf("month");
  const last_of_month = time.endOf("month");

  //1桁の日付を整形して、daysに入れていく
  for (let i = 1; i <= last_of_month.day; i++) {
    let day = i;
    if (String(day).length == 1) {
      day = " " + day;
    }
    days.push(day);
  }

  //月初の曜日に合わせて、空白を設ける
  for (let i = 1; i <= first_of_month.weekday; i++) {
    days.unshift("  ");
  }

  return days;
}

function putsTop(time) {
  const day_of_week = "Su Mo Tu We Th Fr Sa";
  const year_and_month = time.monthLong + " " + time.year;
  const space =
    Math.trunc((20 - year_and_month.length) / 2) + year_and_month.length;

  console.log(year_and_month.padStart(space));
  console.log(day_of_week);
}

function putsBody(days) {
  days.forEach(function (element, index) {
    process.stdout.write(element + " ");
    if ((index + 1) % 7 == 0) {
      process.stdout.write("\n");
    }
  });
}

exec(argv);
