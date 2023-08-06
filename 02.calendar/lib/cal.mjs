import { DateTime } from "luxon";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

function exec(argv) {
  const time = createTime(argv);
  const date = formatDays(time);

  putsTop(time);
  putsBody(date);
}

function createTime(argv) {
  const datebox = { y: DateTime.now().year, m: DateTime.now().month };
  const year = argv.y == undefined ? datebox.y : argv.y;
  const month = argv.m == undefined ? datebox.m : argv.m;
  return DateTime.local(year, month);
}

function formatDays(time) {
  const days = [];
  const first = time.startOf("month");
  const last = time.endOf("month");

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
  const day_of_week = "Su Mo Tu We Th Fr Sa";
  const ym = time.monthLong + " " + time.year;
  const space = Math.trunc((20 - ym.length) / 2);

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
