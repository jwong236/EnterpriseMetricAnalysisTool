import numpy as np
import pandas as pd
import datetime


def generate_deployment_data():
    # Define parameters
    start_date = datetime.date(2023, 1, 1)
    end_date = datetime.date(2023, 12, 31)
    date_range = pd.date_range(start=start_date, end=end_date, freq="W-SUN")
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

    # Poisson distribution for number of deployments per week (mean = 2 deployments per week)
    deployments_per_week = np.random.poisson(2, len(date_range))

    # Prepare data
    data = []
    for week_start_date, deployments in zip(date_range, deployments_per_week):
        for _ in range(deployments):
            deploy_date = week_start_date + datetime.timedelta(
                days=np.random.randint(0, 7)
            )
            deploy_date_str = deploy_date.strftime("%Y-%m-%d")
            team = np.random.choice(teams)
            service = np.random.choice(service_list)
            data.append([deploy_date_str, team, service])

    # Create DataFrame to write to csv
    df = pd.DataFrame(data, columns=["date", "team", "service"])
    df.to_csv("deployment_frequency_DD.csv", index=False)


if __name__ == "__main__":
    generate_deployment_data()
    print(
        "Data generation complete. The file 'deployment_frequency.csv' has been created."
    )
