
import requests
import json
import datetime
import csv
import os
import time
from dotenv import dotenv_values
from collections import defaultdict


def get_pulls(username, token, owner, repos):
    # call github api to get timestamps for pull requests
    # get duration in hours
    results = defaultdict(list)
    datetime_format = "%Y-%m-%dT%H:%M:%SZ"

    for repo in repos:
        pulls_response = requests.get(f"https://api.github.com/repos/{owner}/{repo}/pulls?state=closed&per_page=100", auth=(username,token)).json()
        time.sleep(1)

        for data in pulls_response:
            createdT = datetime.datetime.strptime(data["created_at"], datetime_format)
            closedT = datetime.datetime.strptime(data["closed_at"], datetime_format)
            diff = closedT - createdT
            diffH = diff.days * 24 + diff.seconds // 3600
            results[createdT.date()].append(diffH)

    # process and store data in csv file
    tuples = []
    for date, times in results.items():
        tuples.append([date, sum(times), len(times)])

    with open("pull-request-data.csv", 'w', newline='') as f:
        csv_writer = csv.writer(f)
        csv_writer.writerow(["day", "avg_time", "num_prs"])
        csv_writer.writerows(tuples)


def main():
    print("start")

    vars = dotenv_values("github-vars.env")
    username = vars["GITHUB_USER"]
    token = vars["GITHUB_TOKEN"]
    owner = vars["REPO_OWNER"]
    repos = json.loads(vars["REPO_LIST"])
    pull_data = get_pulls(username, token, owner, repos)

    print("end")


if __name__ == "__main__":
#     main()

