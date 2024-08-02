import numpy as np
import pandas as pd
import datetime


def generate_pr_merge_data():
    # Define parameters
    start_date = datetime.date(2023, 1, 1)
    end_date = datetime.date(2023, 12, 31)
    date_range = pd.date_range(start=start_date, end=end_date, freq="D")
    teams = ["cic", "itcm"]
    repositories = ["repo1", "repo2", "repo3", "repo4", "repo5"]
    authors = ["author1", "author2", "author3", "author4"]
    reviewers = ["reviewer1", "reviewer2", "reviewer3", "reviewer4"]

    # Poisson distribution for number of PR merges per day (mean = 1 merge per day)
    merges_per_day = np.random.poisson(1, len(date_range))

    # Prepare data
    data = []
    pr_id = 100  # Starting PR ID
    for i in range(len(date_range)):
        date_str = date_range[i].strftime("%Y-%m-%d")
        for _ in range(merges_per_day[i]):
            pr_id += 1
            team = np.random.choice(teams)
            repository = np.random.choice(repositories)
            avg_merge_time = np.random.uniform(
                1, 72
            )  # Merge time between 1 and 72 hours
            author = np.random.choice(authors)
            reviewer = np.random.choice(reviewers)
            data.append(
                [date_str, pr_id, team, repository, avg_merge_time, author, reviewer]
            )

    # Create DataFrame to write to csv
    df = pd.DataFrame(
        data,
        columns=[
            "date",
            "pr_id",
            "team",
            "repository",
            "avg_pull_request_merge_time",
            "author",
            "reviewer",
        ],
    )
    df.to_csv("pull_request_merge_time_DD.csv", index=False)


if __name__ == "__main__":
    generate_pr_merge_data()
    print("Data generation complete. The file 'pr_merge_data.csv' has been created.")
