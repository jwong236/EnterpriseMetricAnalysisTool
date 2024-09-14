import numpy as np
import pandas as pd
import datetime


def main():
    # Define parameters
    start_date = datetime.date(2023, 1, 1)
    end_date = datetime.date(2024, 1, 1)
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

    # Randomly choose retro mood values between 1 and 5
    retro_mood_values = np.random.randint(1, 6, len(date_range))

    # Prepare data
    data = []
    for i in range(len(date_range)):
        date_str = date_range[i].strftime("%Y-%m-%d")
        mood_value = retro_mood_values[i]
        team = np.random.choice(teams)
        service = np.random.choice(service_list)
        data.append([date_str, mood_value, team, service])

    # Create DataFrame to write to csv
    df = pd.DataFrame(data, columns=["date", "avg_retro_mood", "team", "service"])
    df.to_csv("retro_mood_DD.csv", index=False)


if __name__ == "__main__":
    main()
    print(
        "Data generation complete. The file 'avg_retro_mood_DD.csv' has been created."
    )
