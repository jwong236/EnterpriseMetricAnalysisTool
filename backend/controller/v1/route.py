from flask import Blueprint, jsonify, request
from scipy.stats import pearsonr
import services.metrics as service
import models.constants as constants



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
            },
            "pull_request_turnaround_time": {
                "route": "/v1/raw_metrics/pull_request_turnaround_time",
                "method": "GET",
                "description": "Get pull request turnaround time for PRs between start and end dates.",
                "parameters": {
                    "start_date": "YYYY-MM-DD",
                    "end_date": "YYYY-MM-DD"
                }
            },
            "avg_blocked_task_time": {
                "route": "/v1/raw_metrics/avg_blocked_task_time",
                "method": "GET",
                "description": "Get avg blocked task time per week between start and end dates.",
                "parameters": {
                    "start_date": "YYYY-MM-DD",
                    "end_date": "YYYY-MM-DD"
                }
            },
            "avg_retro_mood": {
                "route": "/v1/raw_metrics/avg_retro_mood",
                "method": "GET",
                "description": "Get avg retrospective mood score per week between start and end dates.",
                "parameters": {
                    "start_date": "YYYY-MM-DD",
                    "end_date": "YYYY-MM-DD"
                }
            },
            "avg_open_issue_bug_count": {
                "route": "/v1/raw_metrics/avg_open_issue_bug_count",
                "method": "GET",
                "description": "Get avg open issue bug count per week between start and end dates.",
                "parameters": {
                    "start_date": "YYYY-MM-DD",
                    "end_date": "YYYY-MM-DD"
                }
            },
            "refinement_changes_count": {
                "route": "/v1/raw_metrics/refinement_changes_count",
                "method": "GET",
                "description": "Get count of refinement changes per week between start and end dates.",
                "parameters": {
                    "start_date": "YYYY-MM-DD",
                    "end_date": "YYYY-MM-DD"
                }
            }
        }
    })




@bp.route('/correlation', methods=['GET'])
def correlation():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    main_metric = request.args.get('main_metric')
    
    if not (start_date, end_date, main_metric):
        return jsonify({"error": "Required parameters: start_date, end_date, and main_metric are missing."}), 400
    
    # Adjusting date range according to the start day of the week
    start_date, end_date = service.adjust_date_range(start_date, end_date, constants.WEEK_START_DAY)
    
    try:
        # Fetching the data for all metrics and extracting JSON from the response
        deployment_response = service.calculate_deployment_frequency(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))
        lead_time_response = service.calculate_lead_time_for_changes(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))
        turnaround_time_response = service.calculate_avg_pull_request_turnaround_time(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))
        blocked_task_time_response = service.calculate_avg_blocked_task_time(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))
        retro_mood_response = service.calculate_avg_retro_mood(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))
        open_issue_bug_count_response = service.calculate_open_issue_bug_count(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))
        refinement_changes_response = service.calculate_refinement_changes_count(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'))

        deployment_data = deployment_response.get_json()['data']
        lead_time_data = lead_time_response.get_json()['data']
        turnaround_time_data = turnaround_time_response.get_json()['data']
        blocked_task_time_data = blocked_task_time_response.get_json()['data']
        retro_mood_data = retro_mood_response.get_json()['data']
        open_issue_bug_count_data = open_issue_bug_count_response.get_json()['data']
        refinement_changes_data = refinement_changes_response.get_json()['data']

    except Exception as e:
        return jsonify({"error": f"Failed to fetch data: {str(e)}"}), 500
    
    # Extract data points
    metrics_map = {
        'deployment_frequency': [d['deployments'] for d in deployment_data],
        'lead_time_for_changes': [lt['total_lead_time'] for lt in lead_time_data],
        'avg_pull_request_turnaround_time': [tt['avg_pull_request_turnaround_time'] for tt in turnaround_time_data],
        'avg_blocked_task_time': [bt['avg_blocked_task_time'] for bt in blocked_task_time_data],
        'avg_retro_mood': [rm['avg_retro_mood'] for rm in retro_mood_data],
        'open_issue_bug_count': [bc['open_issue_bug_count'] for bc in open_issue_bug_count_data],
        'refinement_changes_count': [rc['refinement_changes_count'] for rc in refinement_changes_data]
    }
    
    # Validate main metric
    main_metric_values = metrics_map.get(main_metric)
    if not main_metric_values:
        return jsonify({"error": f"Invalid main_metric provided: {main_metric}. Choose from {list(metrics_map.keys())}."}), 400
    
    # Calculate correlations
    correlations = {}
    for key, values in metrics_map.items():
        if key != main_metric and len(values) > 1:
            correlation_coefficient, _ = pearsonr(main_metric_values, values)
            correlations[key] = correlation_coefficient
    
    return jsonify({"correlations": correlations})



@bp.route('/raw_metrics/deployment_frequency')
def deployment_frequency():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    if not start_date or not end_date:
        return jsonify({"error": "Both start_date and end_date are required parameters."}), 400

    return service.calculate_deployment_frequency(start_date, end_date)


@bp.route('/raw_metrics/lead_time_for_changes')
def lead_time_for_changes():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    if not start_date or not end_date:
        return jsonify({"error": "Both start_date and end_date are required parameters."}), 400
    return service.calculate_lead_time_for_changes(start_date, end_date)



@bp.route('/raw_metrics/avg_pull_request_turnaround_time')
def avg_pull_request_turnaround_time():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    if not start_date or not end_date:
        return jsonify({"error": "Both 'start_date' and 'end_date' are required parameters."}), 400
    
    return service.calculate_avg_pull_request_turnaround_time(start_date, end_date)





@bp.route('/raw_metrics/avg_blocked_task_time')
def ave_blocked_task_time():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    if not start_date or not end_date:
        return jsonify({"error": "Both start_date and end_date are required parameters."}), 400

    return service.calculate_avg_blocked_task_time(start_date, end_date)
    

@bp.route('/raw_metrics/avg_retro_mood')
def avg_retro_mood():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    if not start_date or not end_date:
        return jsonify({"error": "Both start_date and end_date are required parameters."}), 400

    return service.calculate_avg_retro_mood(start_date, end_date)

@bp.route('/raw_metrics/open_issue_bug_count')
def open_issue_bug_count():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    if not start_date or not end_date:
        return jsonify({"error": "Both start_date and end_date are required parameters."}), 400

    return service.calculate_open_issue_bug_count(start_date, end_date)

@bp.route('/raw_metrics/refinement_changes_count')
def refinement_changes_count():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    if not start_date or not end_date:
        return jsonify({"error": "Both start_date and end_date are required parameters."}), 400

    return service.calculate_refinement_changes_count(start_date, end_date)
