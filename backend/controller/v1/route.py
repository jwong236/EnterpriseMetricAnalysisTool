from flask import Blueprint, jsonify, request
import pandas as pd

WEEKDAYS = {
    'Monday': 0,
    'Tuesday': 1,
    'Wednesday': 2,
    'Thursday': 3,
    'Friday': 4,
    'Saturday': 5,
    'Sunday': 6
}

WEEK_START_DAY = 'Wednesday'


def fetch_data_from_csv(csv_file):
    """Fetches data from a CSV file and returns a DataFrame."""
    return pd.read_csv(csv_file)

def fetch_data_from_database(query, connection):
    pass

def adjust_date_range(start_date, end_date, start_day):
    """ Adjusts the start_date to the previous week's start day and end_date to the following week's end day. """
    weekday = WEEKDAYS[start_day]

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



bp = Blueprint('v1', __name__, url_prefix='/v1')

@bp.route('/')
def index():
    return jsonify({
        "message": "Flask endpoint version 1"
    })

@bp.route('/raw_metrics')
def raw_metrics_index():
    return jsonify({
        "available_metrics": {
            "deployment_frequency": {
                "route": "/v1/raw_metrics/deployment_frequency",
                "method": "GET",
                "description": "Get deployment frequency between start and end dates.",
                "parameters": {
                    "start_date": "YYYY-MM-DD",
                    "end_date": "YYYY-MM-DD"
                }
            },
            "lead_time_for_changes": {
                "route": "/v1/raw_metrics/lead_time_for_changes",
                "method": "GET",
                "description": "Get lead time for changes between start and end dates.",
                "parameters": {
                    "start_date": "YYYY-MM-DD",
                    "end_date": "YYYY-MM-DD"
                }
            }
        }
    })


@bp.route('/raw_metrics/deployment_frequency')
def deployment_frequency():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    if not start_date or not end_date:
        return jsonify({"error": "Both start_date and end_date are required parameters."}), 400

    csv_file = r'C:\Users\Jacob Wong\Documents\UCI-SAP-Capstone\DF_DD.csv'
    try:
        df = pd.read_csv(csv_file)
        df['Day'] = pd.to_datetime(df['Day'])
        start_date, end_date = adjust_date_range(start_date, end_date, WEEK_START_DAY)

        weeks = pd.date_range(start=start_date, end=end_date + pd.Timedelta(days=1), freq=f'W-{WEEK_START_DAY[:3].upper()}')
        weekly_deployments = []

        for i in range(len(weeks) - 1):
            week_start = weeks[i]
            week_end = weeks[i + 1] - pd.Timedelta(days=1)
            weekly_count = df[(df['Day'] >= week_start) & (df['Day'] <= week_end)].shape[0]
            weekly_deployments.append({
                "week_range": f"{week_start.strftime('%Y-%m-%d')} to {week_end.strftime('%Y-%m-%d')}",
                "deployments": weekly_count
            })

        return jsonify({
            "data": weekly_deployments,
            "description": f"Deployment Frequency from {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}"
        })
    except FileNotFoundError:
        return jsonify({"error": "Deployment data file not found."}), 404
    except Exception as e:
        return jsonify({"error": f"An error occurred while processing your request: {str(e)}"}), 500

@bp.route('/raw_metrics/lead_time_for_changes')
def lead_time_for_changes():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    if not start_date or not end_date:
        return jsonify({"error": "Both start_date and end_date are required parameters."}), 400
    csv_file = r'C:\Users\Jacob Wong\Documents\UCI-SAP-Capstone\LTFC_DD.csv'

    try:
        df = pd.read_csv(csv_file)
        df['Day'] = pd.to_datetime(df['Day'])

        start_date, end_date = adjust_date_range(start_date, end_date, WEEK_START_DAY)

        weeks = pd.date_range(start=start_date, end=end_date + pd.Timedelta(days=1), freq=f'W-{WEEK_START_DAY[:3].upper()}')
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

@bp.route('/raw_metrics/pull_request_turnaround_time')
def pull_request_turnaround_time():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    if not start_date or not end_date:
        return jsonify({"error": "Both 'start_date' and 'end_date' are required parameters."}), 400
    
    csv_file = r'C:\Users\Jacob Wong\Documents\UCI-SAP-Capstone\PRTT_DD.csv'

    try:
        df = pd.read_csv(csv_file)
        df['Start_DateTime'] = pd.to_datetime(df['Start_DateTime'])
        df['End_DateTime'] = pd.to_datetime(df['End_DateTime'])
        df['Duration_Hours'] = (df['End_DateTime'] - df['Start_DateTime']).dt.total_seconds() / 3600

        start_date, end_date = adjust_date_range(start_date, end_date, WEEK_START_DAY)

        weeks = pd.date_range(start=start_date, end=end_date + pd.Timedelta(days=1), freq=f'W-{WEEK_START_DAY[:3].upper()}')
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
