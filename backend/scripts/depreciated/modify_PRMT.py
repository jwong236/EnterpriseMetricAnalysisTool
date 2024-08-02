
import csv
import datetime
from datetime import timedelta

def calculate_hours_exclude_weekend(start_time, end_time):
    total_hours = (end_time - start_time).total_seconds() / 3600
    full_weeks = total_hours // (24*7)
    hours_exclude_weekend = full_weeks * 5 * 24

    cur_time = start_time + timedelta(days=full_weeks*7)
    while cur_time < end_time:
        if cur_time.weekday() < 5:
            hours_exclude_weekend += 1
        cur_time += timedelta(hours=1)

    return hours_exclude_weekend

def main():
    tuples = []
    with open('pull-request-data.csv') as f:
        reader = csv.DictReader(f)
        for pr in reader:
            start_time = datetime.datetime.strptime(pr['Start_DateTime'], "%Y-%m-%d %H:%M")
            end_time = datetime.datetime.strptime(pr['End_DateTime'], "%Y-%m-%d %H:%M")
            total_hours = calculate_hours_exclude_weekend(start_time, end_time)
            cur_time = start_time
            while cur_time < end_time:
                next_day = datetime.datetime(cur_time.year, cur_time.month, cur_time.day)
                next_day += timedelta(days=1)
                next_day = min(next_day, end_time)
                if cur_time.weekday() < 5 and total_hours != 0:
                    cur_hours = calculate_hours_exclude_weekend(cur_time, next_day)
                    tuples.append([pr['PR_ID'], cur_time.strftime("%Y-%m-%d %H:%M"), next_day.strftime("%Y-%m-%d %H:%M"), min(cur_hours/total_hours, 1.0)])
                cur_time = next_day


    with open("modified-pull-request-data.csv", 'w', newline='') as newFile:
            csv_writer = csv.writer(newFile)
            csv_writer.writerow(['PR_ID', 'Start_DateTime', 'End_DateTime', 'PR_Count'])
            csv_writer.writerows(tuples)

if __name__ == "__main__":
       main()
