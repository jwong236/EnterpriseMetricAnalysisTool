from flask import jsonify
import pandas as pd
import models.constants as constants
import os
import random

CSV_DIR = os.getcwd()


def fetch_data_from_csv(csv_file):
    """Fetches data from a CSV file and returns a DataFrame."""
    return pd.read_csv(csv_file)


def fetch_data_from_database(query, connection):
    pass


def adjust_date_range(start_date, end_date, start_day):
    """ Adjusts the start_date to the previous week's start day and end_date to the following week's end day. """
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
    Generic function to calculate metrics with random data generation.
    """
    start_date, end_date = adjust_date_range(start_date, end_date, constants.WEEK_START_DAY)
    weeks = pd.date_range(start=start_date, end=end_date + pd.Timedelta(days=1), freq=f'W-{constants.WEEK_START_DAY[:3].upper()}')
    data = [{
        "week_range": f"{week.strftime('%Y-%m-%d')} to {(week + pd.Timedelta(days=6)).strftime('%Y-%m-%d')}",
        metric_name: random.choice([2, 3, 6])
    } for week in weeks[:-1]]

    return jsonify({
        "data": data,
        "description": f"{metric_name} from {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}"
    })

def calculate_average_blocked_task_time(start_date, end_date):
    return calculate_metric(start_date, end_date, "average_blocked_task_time")

def calculate_average_retro_mood(start_date, end_date):
    return calculate_metric(start_date, end_date, "average_retro_mood")

def calculate_average_open_issue_bug_count(start_date, end_date):
    return calculate_metric(start_date, end_date, "average_open_issue_bug_count")

def calculate_refinement_changes_count(start_date, end_date):
    return calculate_metric(start_date, end_date, "refinement_changes_count")

def calculate_lead_time_for_changes(start_date, end_date):
    csv_file = os.path.join(CSV_DIR, "scripts", "LTFC_DD.csv")

    try:
        df = pd.read_csv(csv_file)
        df['Day'] = pd.to_datetime(df['Day'])

        start_date, end_date = adjust_date_range(start_date, end_date, constants.WEEK_START_DAY)

        weeks = pd.date_range(start=start_date, end=end_date + pd.Timedelta(days=1), freq=f'W-{constants.WEEK_START_DAY[:3].upper()}')
        weekly_lead_times = []

        for i in range(len(weeks) - 1):
            week_start = weeks[i]
            week_end = weeks[i + 1] - pd.Timedelta(days=1)
            weekly_filtered_df = df[(df['Day'] >= week_start) & (df['Day'] <= week_end)]
            total_lead_time = weekly_filtered_df['Time to Change Hours'].sum()
            weekly_lead_times.append({
                "week_range": f"{week_start.strftime('%Y-%m-%d')} to {week_end.strftime('%Y-%m-%d')}",
                "total_lead_time": int(total_lead_time)
            })

        return jsonify({
            "data": weekly_lead_times,
            "description": f"Total lead time for changes from {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}"
        })
    except FileNotFoundError:
        return jsonify({"error": "Lead Time for Changes data file not found."}), 404
    except Exception as e:
        return jsonify({"error": f"An error occurred while processing your request: {str(e)}"}), 500
    

def calculate_deployment_frequency(start_date, end_date):
    csv_file = os.path.join(CSV_DIR, "scripts", "DF_DD.csv")
    try:
        df = pd.read_csv(csv_file)
        df['Day'] = pd.to_datetime(df['Day'])
        start_date, end_date = adjust_date_range(start_date, end_date, constants.WEEK_START_DAY)

        weeks = pd.date_range(start=start_date, end=end_date + pd.Timedelta(days=1), freq=f'W-{constants.WEEK_START_DAY[:3].upper()}')
        weekly_deployments = []

        for i in range(len(weeks) - 1):
            week_start = weeks[i]
            week_end = weeks[i + 1] - pd.Timedelta(days=1)
            weekly_count = df[(df['Day'] >= week_start) & (df['Day'] <= week_end)].shape[0]
            weekly_deployments.append({
                "week_range": f"{week_start.strftime('%Y-%m-%d')} to {week_end.strftime('%Y-%m-%d')}",
                "deployments": weekly_count
            })
    except FileNotFoundError:
        return jsonify({"error": "Deployment data file not found."}), 404
    except Exception as e:
        return jsonify({"error": f"An error occurred while processing your request: {str(e)}"}), 500
    return jsonify({
        "data": weekly_deployments,
        "description": f"Deployment Frequency from {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}"
    })


def calculate_pull_request_turnaround_time(start_date, end_date):
    csv_file = os.path.join(CSV_DIR, "scripts", "PRTT_DD.csv")

    try:
        df = pd.read_csv(csv_file)
        df['Start_DateTime'] = pd.to_datetime(df['Start_DateTime'])
        df['End_DateTime'] = pd.to_datetime(df['End_DateTime'])
        df['Duration_Hours'] = (df['End_DateTime'] - df['Start_DateTime']).dt.total_seconds() / 3600

        start_date, end_date = adjust_date_range(start_date, end_date, constants.WEEK_START_DAY)

        weeks = pd.date_range(start=start_date, end=end_date + pd.Timedelta(days=1), freq=f'W-{constants.WEEK_START_DAY[:3].upper()}')
        weekly_turnaround = []

        for i in range(len(weeks) - 1):
            week_start = weeks[i]
            week_end = weeks[i + 1] - pd.Timedelta(days=1)
            df['week_contribution'] = df.apply(lambda x: min(x['End_DateTime'], week_end) - max(x['Start_DateTime'], week_start), axis=1)
            df['week_contribution'] = df['week_contribution'].dt.total_seconds() / 3600
            df['week_contribution'] = df['week_contribution'].apply(lambda x: max(x, 0))
            
            df['pr_contribution'] = df['week_contribution'] / df['Duration_Hours']
            total_week_turnaround = df['week_contribution'].sum()
            pr_count = df['pr_contribution'].sum()

            average_turnaround = total_week_turnaround / pr_count if pr_count else 0
            
            weekly_turnaround.append({
                "week_range": f"{week_start.strftime('%Y-%m-%d')} to {week_end.strftime('%Y-%m-%d')}",
                "average_turnaround_time": average_turnaround,
                "pr_count": pr_count,
                "total_turnaround_time": total_week_turnaround
            })

        return jsonify({
            "data": weekly_turnaround,
            "description": f"Pull Request Turnaround Time from {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}"
        })
    except FileNotFoundError:
        return jsonify({"error": "Turnaround time data file not found."}), 404
    except Exception as e:
        return jsonify({"error": f"An error occurred while processing your request: {str(e)}"}), 500
