from flask import jsonify
import pandas as pd
import models.constants as constants
import os
import random


def calculate_deployment_frequency(start_date, end_date):
    """Calculates the deployment frequency for each week within a specified date range.

    Args:
        start_date (str): First date of the date range block in the format 'YYYY-MM-DD'.
        end_date (str): Last date of the date range block in the format 'YYYY-MM-DD'.

    Returns:
        JSON: A JSON object containing the deployment frequency data for each week within the specified date range.
    """
    try:
        # Load deployment data from CSV file, convert date column to datetime and adjust date range
        csv_file = os.path.join(os.getcwd(), "services", "deployment_frequency_DD.csv")
        df = pd.read_csv(csv_file)
        df["date"] = pd.to_datetime(df["date"])
        start_date, end_date = adjust_date_range(
            start_date, end_date, constants.WEEK_START_DAY
        )

        # Create DatetimeIndex objects for each week within start_date and end_date
        weeks = pd.date_range(
            start=start_date,
            end=end_date + pd.Timedelta(days=1),
            # Add 1 day to include the week that starts on end_date
            freq=f"W-{constants.WEEK_START_DAY[:3].upper()}",
        )
        weekly_deployments = []

        # Count deployments for each week and store the data in a list
        for i in range(len(weeks) - 1):
            week_start = weeks[i]
            week_end = weeks[i + 1] - pd.Timedelta(days=1)
            # Count number of rows where the value in the date column falls within a specific weekly date range
            weekly_count = df[
                (df["date"] >= week_start) & (df["date"] <= week_end)
            ].shape[0]
            weekly_deployments.append(
                {
                    "week_range": f"{week_start.strftime('%Y-%m-%d')} to {week_end.strftime('%Y-%m-%d')}",
                    "deployments": weekly_count,
                }
            )
    except FileNotFoundError:
        return jsonify({"error": "Deployment data file not found."}), 404
    except Exception as e:
        return (
            jsonify(
                {"error": f"An error occurred while processing your request: {str(e)}"}
            ),
            500,
        )
    return jsonify(
        {
            "data": weekly_deployments,
            "description": f"Deployment Frequency from {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
        }
    )


def calculate_lead_time_for_changes(start_date, end_date):
    """Calculates the average lead time for changes for each week within a specified date range.

    Args:
        start_date (str): First date of the date range block in the format 'YYYY-MM-DD'.
        end_date (str): Last date of the date range block in the format 'YYYY-MM-DD'.

    Returns:
        JSON: A JSON object containing the average lead time for changes data for each week within the specified date range.
    """
    csv_file = os.path.join(os.getcwd(), "services", "lead_time_for_changes_DD.csv")

    try:
        # Load the data from the CSV file and convert the date column to datetime
        df = pd.read_csv(csv_file)
        df["date"] = pd.to_datetime(df["date"])

        # Adjust the date range
        start_date, end_date = adjust_date_range(
            start_date, end_date, constants.WEEK_START_DAY
        )

        # Create DatetimeIndex objects for each week within start_date and end_date
        weeks = pd.date_range(
            start=start_date,
            end=end_date + pd.Timedelta(days=1),
            freq=f"W-{constants.WEEK_START_DAY[:3].upper()}",
        )
        weekly_lead_times = []

        # Calculate average lead time for each week and store the data in a list
        for i in range(len(weeks) - 1):
            week_start = weeks[i]
            week_end = weeks[i + 1] - pd.Timedelta(days=1)
            # Filter the dataframe for the current week range
            weekly_filtered_df = df[
                (df["date"] >= week_start) & (df["date"] <= week_end)
            ]
            # Calculate the total and average lead time for the week
            total_lead_time = weekly_filtered_df["time_to_change_hours"].sum()
            num_entries = weekly_filtered_df.shape[0]
            average_lead_time = total_lead_time / num_entries if num_entries > 0 else 0
            # Append the result to the list
            weekly_lead_times.append(
                {
                    "week_range": f"{week_start.strftime('%Y-%m-%d')} to {week_end.strftime('%Y-%m-%d')}",
                    "total_lead_time": round(total_lead_time),
                    "average_lead_time": round(average_lead_time),
                }
            )

        # Return the results as a JSON object
        return jsonify(
            {
                "data": weekly_lead_times,
                "description": f"Lead time for changes from {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            }
        )
    except FileNotFoundError:
        return jsonify({"error": "Lead Time for Changes data file not found."}), 404
    except Exception as e:
        return (
            jsonify(
                {"error": f"An error occurred while processing your request: {str(e)}"}
            ),
            500,
        )


def adjust_date_range(start_date, end_date, start_day):
    """Adjusts the start_date to the previous week's start day and end_date to the following week's end day."""
    weekday = constants.WEEKDAYS[start_day]

    # Adjust start_date to the nearest previous start_day
    start_date = pd.to_datetime(start_date)
    while start_date.weekday() != weekday:
        start_date -= pd.Timedelta(days=1)

    # Adjust end_date to the nearest following end_day (which is the day before start_day)
    end_date = pd.to_datetime(end_date)
    end_day = (weekday - 1) % 7
    while end_date.weekday() != end_day:
        end_date += pd.Timedelta(days=1)

    return start_date, end_date


def calculate_metric(start_date, end_date, metric_name):
    """
    Generic function to calculate metrics with trend-based random data generation.
    """
    start_date, end_date = adjust_date_range(
        start_date, end_date, constants.WEEK_START_DAY
    )
    weeks = pd.date_range(
        start=start_date,
        end=end_date + pd.Timedelta(days=1),
        freq=f"W-{constants.WEEK_START_DAY[:3].upper()}",
    )

    metric_value = random.randint(30, 50)
    change_range = [30, -10, -5, -5, 0, 5, 10]

    data = []
    for week in weeks[:-1]:
        metric_value += random.choice(change_range)
        metric_value = max(1, metric_value)

        week_data = {
            "week_range": f"{week.strftime('%Y-%m-%d')} to {(week + pd.Timedelta(days=6)).strftime('%Y-%m-%d')}",
            metric_name: metric_value,
        }
        data.append(week_data)

    return jsonify(
        {
            "data": data,
            "description": f"{metric_name} from {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
        }
    )


def calculate_avg_blocked_task_time(start_date, end_date):
    return calculate_metric(start_date, end_date, "avg_blocked_task_time")


def calculate_avg_retro_mood(start_date, end_date):
    return calculate_metric(start_date, end_date, "avg_retro_mood")


def calculate_open_issue_bug_count(start_date, end_date):
    return calculate_metric(start_date, end_date, "open_issue_bug_count")


def calculate_refinement_changes_count(start_date, end_date):
    return calculate_metric(start_date, end_date, "refinement_changes_count")


def calculate_avg_pull_request_turnaround_time(start_date, end_date):
    csv_file = os.path.join(CSV_DIR, "scripts", "PRTT_DD.csv")

    try:
        df = pd.read_csv(csv_file)
        df["Start_DateTime"] = pd.to_datetime(df["Start_DateTime"])
        df["End_DateTime"] = pd.to_datetime(df["End_DateTime"])
        df["Duration_Hours"] = (
            df["End_DateTime"] - df["Start_DateTime"]
        ).dt.total_seconds() / 3600

        start_date, end_date = adjust_date_range(
            start_date, end_date, constants.WEEK_START_DAY
        )

        weeks = pd.date_range(
            start=start_date,
            end=end_date + pd.Timedelta(days=1),
            freq=f"W-{constants.WEEK_START_DAY[:3].upper()}",
        )
        weekly_turnaround = []

        for i in range(len(weeks) - 1):
            week_start = weeks[i]
            week_end = weeks[i + 1] - pd.Timedelta(days=1)
            df["week_contribution"] = df.apply(
                lambda x: min(x["End_DateTime"], week_end)
                - max(x["Start_DateTime"], week_start),
                axis=1,
            )
            df["week_contribution"] = df["week_contribution"].dt.total_seconds() / 3600
            df["week_contribution"] = df["week_contribution"].apply(lambda x: max(x, 0))

            df["pr_contribution"] = df["week_contribution"] / df["Duration_Hours"]
            total_week_turnaround = df["week_contribution"].sum()
            pr_count = df["pr_contribution"].sum()

            avg_pull_request_turnaround_time = (
                total_week_turnaround / pr_count if pr_count else 0
            )

            weekly_turnaround.append(
                {
                    "week_range": f"{week_start.strftime('%Y-%m-%d')} to {week_end.strftime('%Y-%m-%d')}",
                    "avg_pull_request_turnaround_time": round(
                        avg_pull_request_turnaround_time
                    ),
                    "pr_count": pr_count,
                    "total_turnaround_time": round(total_week_turnaround),
                }
            )

        return jsonify(
            {
                "data": weekly_turnaround,
                "description": f"Pull Request Merge Time from {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}",
            }
        )
    except FileNotFoundError:
        return jsonify({"error": "Merge time data file not found."}), 404
    except Exception as e:
        return (
            jsonify(
                {"error": f"An error occurred while processing your request: {str(e)}"}
            ),
            500,
        )
