import csv
import random
from datetime import timedelta, date

def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days) + 1):
        yield start_date + timedelta(n)

def generate_data(start_date, end_date, filename):
    teams = ['itcm']
    services = ['agreement-search', 'agreement-masterdata', 'api-management', 'claims-backend', 'attachment-ng']

    with open(filename, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Day', 'Time to Change Hours', 'Team', 'Service'])

        for single_date in daterange(start_date, end_date):
            day = single_date.strftime("%Y-%m-%d")
            time_to_change_hours = random.randint(1, 24)
            team = random.choice(teams)
            service = random.choice(services)
            writer.writerow([day, time_to_change_hours, team, service])

def main():
    start_date = date(2023, 1, 1)
    end_date = date(2024, 12, 31)
    daterange(start_date, end_date)

    filename = 'LTFC_DD.csv'
    generate_data(start_date, end_date, filename)

if __name__ == "__main__":
    main()