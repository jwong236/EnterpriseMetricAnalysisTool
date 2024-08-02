import numpy as np
import pandas as pd
import datetime


def generate_blocked_task_data():
    # Define parameters
    start_date = datetime.date(2023, 1, 2)
    end_date = datetime.date(2023, 12, 31)
    date_range = pd.date_range(start=start_date, end=end_date, freq="W-MON")
    teams = ["cic", "itcm"]
    service_list = [
        "agreement-search",
        "agreement-masterdata",
        "api-management",
        "claims-backend",
        "attachment-ng",
        "comment-ui",
        "claims-submission-ui",
        "api-management-ui",
        "claims-submission-ui",
        "document library",
        "claims backend",
    ]

    # Prepare data
    data = []
    for date in date_range:
        date_str = date.strftime("%Y-%m-%d")
        blocked_hours = np.random.choice(
            [
                np.random.uniform(1, 2),
                np.random.uniform(3, 8),
                np.random.uniform(9, 16),
                np.random.uniform(17, 40),
            ]
        )
        team = np.random.choice(teams)
        service = np.random.choice(service_list)
        data.append([date_str, blocked_hours, team, service])

    # Create DataFrame to write to csv
    df = pd.DataFrame(data, columns=["date", "blocked_hours", "team", "service"])
    df.to_csv("blocked_task_time_DD.csv", index=False)


if __name__ == "__main__":
    generate_blocked_task_data()
    print(
        "Data generation complete. The file 'blocked_task_time.csv' has been created."
    )
