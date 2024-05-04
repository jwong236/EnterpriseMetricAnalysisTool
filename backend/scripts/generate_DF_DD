import csv
import random
import numpy as np
from datetime import timedelta, date

def generate_trendy_dates(start_date, end_date, num_points):
    total_days = (end_date - start_date).days
    x = np.linspace(0, total_days, num_points)
    a, b, c = 0.01, 0.1, 2
    y = a*x**2 + b*x + c
    noise = np.random.normal(0, 10, num_points)
    y_noisy = y + noise
    dates = [start_date + timedelta(days=int(max(0, day))) for day in y_noisy]
    return dates

def generate_data(start_date, end_date, filename, num_points):
    teams = ['itcm']
    services = ['agreement-search', 'agreement-masterdata', 'api-management', 'claims-backend', 'attachment-ng']
    with open(filename, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Day', 'Deployment hash', 'Team', 'Service'])
        
        deployment_dates = generate_trendy_dates(start_date, end_date, num_points)
        
        for day in deployment_dates:
            date_str = day.strftime("%Y-%m-%d")
            deployment_desc = "Deployment hash"
            team = random.choice(teams)
            service = random.choice(services)
            writer.writerow([date_str, deployment_desc, team, service])

def main():
    start_date = date(2023, 1, 1)
    end_date = date(2024, 12, 31)
    filename = 'DF_DD.csv'
    num_points = 300
    generate_data(start_date, end_date, filename, num_points)

if __name__ == "__main__":
    main()
