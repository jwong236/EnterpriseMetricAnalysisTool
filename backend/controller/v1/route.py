from flask import Blueprint, jsonify, request
from scipy.stats import pearsonr
import services.metrics as service
import models.constants as constants


bp = Blueprint("v1", __name__)


@bp.route("/correlation", methods=["GET"])
def correlation():
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    main_metric = request.args.get("main_metric")

    if not (start_date, end_date, main_metric):
        return (
            jsonify(
                {
                    "error": "Required parameters: start_date, end_date, and main_metric are missing."
                }
            ),
            400,
        )

    # Adjusting date range according to the start day of the week
    start_date, end_date = service.adjust_date_range(
        start_date, end_date, constants.WEEK_START_DAY
    )

    # 1. Fetch full json data for all metrics
    try:
        deployment_response = service.calculate_deployment_frequency(
            start_date, end_date
        )
        lead_time_response = service.calculate_lead_time_for_changes(
            start_date, end_date
        )
        turnaround_time_response = service.calculate_avg_pull_request_merge_time(
            start_date, end_date
        )
        blocked_task_time_response = service.calculate_avg_blocked_task_time(
            start_date, end_date
        )
        retro_mood_response = service.calculate_avg_retro_mood(start_date, end_date)
        open_issue_bug_count_response = service.calculate_open_issue_bug_count(
            start_date, end_date
        )
        refinement_changes_response = service.calculate_refinement_changes_count(
            start_date, end_date
        )

        # 2. Extract data field from responses
        deployment_data = deployment_response.get_json()["data"]
        lead_time_data = lead_time_response.get_json()["data"]
        turnaround_time_data = turnaround_time_response.get_json()["data"]
        blocked_task_time_data = blocked_task_time_response.get_json()["data"]
        retro_mood_data = retro_mood_response.get_json()["data"]
        open_issue_bug_count_data = open_issue_bug_count_response.get_json()["data"]
        refinement_changes_data = refinement_changes_response.get_json()["data"]

    except Exception as e:
        return jsonify({"error": f"Failed to fetch data: {str(e)}"}), 500

    # 3. Extract data points field for each metric
    metrics_map = {
        constants.METRIC_ID[1]: [d[constants.CSV_FIELD[1]] for d in deployment_data],
        constants.METRIC_ID[2]: [lt[constants.CSV_FIELD[2]] for lt in lead_time_data],
        constants.METRIC_ID[3]: [
            tt[constants.CSV_FIELD[3]] for tt in turnaround_time_data
        ],
        constants.METRIC_ID[4]: [
            bt[constants.CSV_FIELD[4]] for bt in blocked_task_time_data
        ],
        constants.METRIC_ID[5]: [rm[constants.CSV_FIELD[5]] for rm in retro_mood_data],
        constants.METRIC_ID[6]: [
            bc[constants.CSV_FIELD[6]] for bc in open_issue_bug_count_data
        ],
        constants.METRIC_ID[7]: [
            rc[constants.CSV_FIELD[7]] for rc in refinement_changes_data
        ],
    }

    # Validate main metric
    main_metric_values = metrics_map.get(main_metric)
    if not main_metric_values:
        return (
            jsonify(
                {
                    "error": f"Invalid main_metric provided: {main_metric}. Choose from {list(metrics_map.keys())}."
                }
            ),
            400,
        )

    # Calculate correlations
    correlations = {}
    for key, values in metrics_map.items():
        if key != main_metric and len(values) > 1:
            correlation_coefficient, _ = pearsonr(main_metric_values, values)
            correlations[key] = correlation_coefficient

    return jsonify({"correlations": correlations})


@bp.route("/raw_metrics/deployment_frequency")
def deployment_frequency():
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    if not start_date or not end_date:
        return (
            jsonify({"error": "Both start_date and end_date are required parameters."}),
            400,
        )

    return service.calculate_deployment_frequency(start_date, end_date)


@bp.route("/raw_metrics/lead_time_for_changes")
def lead_time_for_changes():
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    if not start_date or not end_date:
        return (
            jsonify({"error": "Both start_date and end_date are required parameters."}),
            400,
        )
    return service.calculate_lead_time_for_changes(start_date, end_date)


@bp.route("/raw_metrics/avg_pull_request_merge_time")
def avg_pull_request_merge_time():
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    if not start_date or not end_date:
        return (
            jsonify(
                {"error": "Both 'start_date' and 'end_date' are required parameters."}
            ),
            400,
        )

    return service.calculate_avg_pull_request_merge_time(start_date, end_date)


@bp.route("/raw_metrics/avg_blocked_task_time")
def avg_blocked_task_time():
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    if not start_date or not end_date:
        return (
            jsonify({"error": "Both start_date and end_date are required parameters."}),
            400,
        )

    return service.calculate_avg_blocked_task_time(start_date, end_date)


@bp.route("/raw_metrics/avg_retro_mood")
def avg_retro_mood():
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    if not start_date or not end_date:
        return (
            jsonify({"error": "Both start_date and end_date are required parameters."}),
            400,
        )

    return service.calculate_avg_retro_mood(start_date, end_date)


@bp.route("/raw_metrics/open_issue_bug_count")
def open_issue_bug_count():
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    if not start_date or not end_date:
        return (
            jsonify({"error": "Both start_date and end_date are required parameters."}),
            400,
        )

    return service.calculate_open_issue_bug_count(start_date, end_date)


@bp.route("/raw_metrics/refinement_changes_count")
def refinement_changes_count():
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    if not start_date or not end_date:
        return (
            jsonify({"error": "Both start_date and end_date are required parameters."}),
            400,
        )

    return service.calculate_refinement_changes_count(start_date, end_date)
