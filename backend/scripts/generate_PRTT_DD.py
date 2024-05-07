import csv
import random
from datetime import datetime, timedelta

def generate_random_datetime(start_date, end_date):
    """Generate a random datetime within the given date range."""
    delta = end_date - start_date
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = random.randrange(int_delta)
    return start_date + timedelta(seconds=random_second)

def generate_data(start_date, end_date, filename):
    with open(filename, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['PR_ID', 'Start_DateTime', 'End_DateTime'])

        pr_id = 1
        # Generate data for each day in the range (we'll randomly decide if a PR starts on this day)
        for n in range((end_date - start_date).days):
            day = start_date + timedelta(days=n)
            # Randomly decide how many PRs start on this day
            num_prs_starting_today = random.randint(0, 3)  # Randomly 0 to 3 PRs start today

            for _ in range(num_prs_starting_today):
                start_time = generate_random_datetime(day, day + timedelta(days=1))
                # Ensure that PR ends within 1 to 3 days from the start
                end_time = start_time + timedelta(days=random.randint(0, 2), hours=random.randint(1, 24))

                writer.writerow([pr_id, start_time.strftime("%Y-%m-%d %H:%M"), end_time.strftime("%Y-%m-%d %H:%M")])
                pr_id += 1

def main():
    start_date = datetime(2023, 1, 1)
    end_date = datetime(2024, 12, 31)
    filename = 'PRTT_DD.csv'
    generate_data(start_date, end_date, filename)

if __name__ == "__main__":
    main()
