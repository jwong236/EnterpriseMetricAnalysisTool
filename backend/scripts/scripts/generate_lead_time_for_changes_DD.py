import numpy as np
import pandas as pd
import datetime


def generate_lead_time_data():
    # Define parameters
    start_date = datetime.date(2023, 1, 1)
    end_date = datetime.date(2023, 12, 31)
    date_range = pd.date_range(start=start_date, end=end_date, freq="D")
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

    # Initialize lead time values
    lead_time_values = []

    # Start with a random initial value between 1 and 2000
    initial_value = np.random.randint(500, 1500)
    lead_time_values.append(initial_value)

    # Generate lead time values using a random walk process
    for i in range(1, len(date_range)):
        change = np.random.normal(
            0, 100
        )  # Normal distribution with mean 0 and std deviation 100
        new_value = lead_time_values[-1] + change
        # Ensure the value stays within the 1 to 2000 range
        new_value = max(1, min(int(new_value), 2000))
        lead_time_values.append(new_value)

    # Prepare data
    data = []
    for date, lead_time in zip(date_range, lead_time_values):
        date_str = date.strftime("%Y-%m-%d")
        team = np.random.choice(teams)
        service = np.random.choice(service_list)
        data.append([date_str, lead_time, team, service])

    # Create DataFrame to write to csv
    df = pd.DataFrame(data, columns=["date", "time_to_change_hours", "team", "service"])
    df.to_csv("lead_time_for_changes_DD.csv", index=False)


if __name__ == "__main__":
    generate_lead_time_data()
    print(
        "Data generation complete. The file 'lead_time_for_changes_DD.csv' has been created."
    )
