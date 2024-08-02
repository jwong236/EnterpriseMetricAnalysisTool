import numpy as np
import pandas as pd
import uuid
import datetime


def main():
    # Define parameters
    start_date = datetime.date(2023, 1, 1)
    end_date = datetime.date(2023, 12, 31)
    date_range = pd.date_range(start=start_date, end=end_date, freq="D")
    teams = ["cic", "itcm"]
    services = [
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

    # Poisson distribution for number of changes per day (mean = .5 change per day)
    changes_per_day = np.random.poisson(0.5, len(date_range))

    # Prepare data
    data = []
    for i in range(len(date_range)):
        date_str = date_range[i].strftime("%Y-%m-%d")
        for _ in range(changes_per_day[i]):
            change_id = str(uuid.uuid4())
            team = np.random.choice(teams)
            service = np.random.choice(services)
            data.append([date_str, change_id, team, service])

    # Create DataFrame to write to csv
    df = pd.DataFrame(data, columns=["date", "change_id", "team", "service"])
    df.to_csv("refinement_changes_count_DD.csv", index=False)


if __name__ == "__main__":
    main()
    print(
        "Data generation complete. The file 'refinement_changes_count_DD.csv' has been created."
    )
