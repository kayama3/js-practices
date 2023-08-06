import { DateTime } from "luxon";
import minimist from "minimist";

let argv = minimist(process.argv.slice(2));

function exec(argv) {
  let time = createTime(argv);
  let date = formatDays(time);

  putsTop(time);
  putsBody(date);
}

function createTime(argv) {
  let datebox = { y: DateTime.now().year, m: DateTime.now().month };
  let year = argv.y == undefined ? datebox.y : argv.y;
  let month = argv.m == undefined ? datebox.m : argv.m;
  return DateTime.local(year, month);
}

function formatDays(time) {
  let days = [];
  let first = time.startOf("month");
  let last = time.endOf("month");

  //1桁の日付を整形して、daysに入れていく
  for (let i = first.day; i <= last.day; i++) {
    if (String(i).length == 1) {
      i = " " + i;
    }
    days.push(i);
  }

  //月初の曜日に合わせて、空白を設ける
  for (let i = 1; i <= first.weekday; i++) {
    days.unshift("  ");
  }

  return days;
}

function putsTop(time) {
  let day_of_week = "Su Mo Tu We Th Fr Sa";
  let ym = time.monthLong + " " + time.year;
  let space = Math.trunc((20 - ym.length) / 2);

  console.log(ym.padStart(space + ym.length));
  console.log(day_of_week);
}

function putsBody(date) {
  date.forEach(function (element, index) {
    process.stdout.write(element + " ");
    if ((index + 1) % 7 == 0) {
      process.stdout.write("\n");
    }
  });
}

exec(argv);
