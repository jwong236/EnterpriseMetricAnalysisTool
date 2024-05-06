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
                "description": "Get pull request turnaround_time for PRs between start and end dates.",
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
    
    if not (start_date and end_date and main_metric):
        return jsonify({"error": "Required parameters are missing."}), 400
    
    start_date, end_date = service.adjust_date_range(start_date, end_date, constants.WEEK_START_DAY)
    
    deployment_data = service.calculate_deployment_frequency(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')).get_json()['data']
    lead_time_data = service.calculate_lead_time_for_changes(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')).get_json()['data']
    turnaround_time_data = service.calculate_pull_request_turnaround_time(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')).get_json()['data']
    
    deployment_frequency = [d['deployments'] for d in deployment_data]
    lead_times = [lt['total_lead_time'] for lt in lead_time_data]
    average_turnaround_times = [tt['average_turnaround_time'] for tt in turnaround_time_data]
    
    metrics_map = {
        'deployment_frequency': deployment_frequency,
        'lead_times': lead_times,
        'average_turnaround_time': average_turnaround_times
    }
    
    main_metric_values = metrics_map.get(main_metric)
    
    if not main_metric_values:
        return jsonify({"error": "Invalid main_metric provided."}), 400
    
    correlations = {}
    for key, values in metrics_map.items():
        if key != main_metric:
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



@bp.route('/raw_metrics/pull_request_turnaround_time')
def pull_request_turnaround_time():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    if not start_date or not end_date:
        return jsonify({"error": "Both 'start_date' and 'end_date' are required parameters."}), 400
    
    return service.calculate_pull_request_turnaround_time(start_date, end_date)





@bp.route('/raw_metrics/average_blocked_task_time')
def average_blocked_task_time():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    if not start_date or not end_date:
        return jsonify({"error": "Both start_date and end_date are required parameters."}), 400

    data = service.calculate_average_blocked_task_time(start_date, end_date)
    return jsonify(data)

@bp.route('/raw_metrics/average_retro_mood')
def average_retro_mood():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    if not start_date or not end_date:
        return jsonify({"error": "Both start_date and end_date are required parameters."}), 400

    data = service.calculate_average_retro_mood(start_date, end_date)
    return jsonify(data)

@bp.route('/raw_metrics/average_open_issue_bug_count')
def average_open_issue_bug_count():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    if not start_date or not end_date:
        return jsonify({"error": "Both start_date and end_date are required parameters."}), 400

    data = service.calculate_average_open_issue_bug_count(start_date, end_date)
    return jsonify(data)

@bp.route('/raw_metrics/refinement_changes_count')
def refinement_changes_count():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    if not start_date or not end_date:
        return jsonify({"error": "Both start_date and end_date are required parameters."}), 400

    data = service.calculate_refinement_changes_count(start_date, end_date)
    return jsonify(data)
