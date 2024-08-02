import numpy as np
import pandas as pd
import datetime


def generate_open_issue_bug_count():
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
    open_issue_bug_count = []

    # Start with a random initial value between 30 and 100
    initial_value = np.random.randint(30, 100)
    open_issue_bug_count.append(initial_value)

    # Generate lead time values using a random walk process
    for i in range(1, len(date_range)):
        change = np.random.normal(
            0, 10
        )  # Normal distribution with mean 0 and std deviation 10
        new_value = open_issue_bug_count[-1] + change
        # Ensure the value stays within the 1 to 800 range
        new_value = max(1, min(int(new_value), 800))
        open_issue_bug_count.append(new_value)

    # Prepare data
    data = []
    for date, lead_time in zip(date_range, open_issue_bug_count):
        date_str = date.strftime("%Y-%m-%d")
        team = np.random.choice(teams)
        service = np.random.choice(service_list)
        data.append([date_str, lead_time, team, service])

    # Create DataFrame to write to csv
    df = pd.DataFrame(data, columns=["date", "open_issue_bug_count", "team", "service"])
    df.to_csv("open_issue_bug_count_DD.csv", index=False)


if __name__ == "__main__":
    generate_open_issue_bug_count()
    print(
        "Data generation complete. The file 'open_issue_bug_count_DD.csv' has been created."
    )
