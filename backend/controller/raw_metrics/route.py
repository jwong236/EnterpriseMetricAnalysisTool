from flask import Blueprint, jsonify, request
import pandas as pd
import os

bp = Blueprint('raw_metrics', __name__, url_prefix='/raw_metrics')

@bp.route('/')
def index():
    return jsonify({
        "available_metrics": {
            "deployment_frequency": {
                "route": "/metrics/deployment_frequency",
                "method": "GET",
                "description": "Get deployment frequency between start and end dates.",
                "parameters": {
                    "start_date": "YYYY-MM-DD",
                    "end_date": "YYYY-MM-DD"
                }
            },
            "lead_time_for_changes": {
                "route": "/metrics/lead_time_for_changes",
                "method": "GET",
                "description": "Get lead time for changes between start and end dates.",
                "parameters": {
                    "start_date": "YYYY-MM-DD",
                    "end_date": "YYYY-MM-DD"
                }
            }
        }
    })

@bp.route('/deployment_frequency')
def deployment_frequency():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    csv_file = r'C:\Users\Jacob Wong\Documents\UCI-SAP-Capstone\DF_DD.csv'

    try:
        df = pd.read_csv(csv_file)
        df['Day'] = pd.to_datetime(df['Day'])
        filtered_df = df[(df['Day'] >= pd.to_datetime(start_date)) & (df['Day'] <= pd.to_datetime(end_date))]
        return jsonify({
            "data": filtered_df.to_dict(orient='records')
        })
    except FileNotFoundError:
        return jsonify({"error": "Deployment data file not found."}), 404
    except Exception as e:
        return jsonify({"error": "An error occurred while processing your request: {}".format(str(e))}), 500


@bp.route('/lead_time_for_changes')
def lead_time_for_changes():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    csv_file = r'C:\Users\Jacob Wong\Documents\UCI-SAP-Capstone\LTFC_DD.csv'

    try:
        df = pd.read_csv(csv_file)
        df['Day'] = pd.to_datetime(df['Day'])
        filtered_df = df[(df['Day'] >= pd.to_datetime(start_date)) & (df['Day'] <= pd.to_datetime(end_date))]
        return jsonify({
            "data": filtered_df.to_dict(orient='records')
        })
    except FileNotFoundError:
        return jsonify({"error": "Lead Time for Changes data file not found."}), 404
    except Exception as e:
        return jsonify({"error": "An error occurred while processing your request: {}".format(str(e))}), 500

@bp.route('/test')
def test():
    return jsonify({
        "test": "test",
    })