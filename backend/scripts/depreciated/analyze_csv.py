import csv
from datetime import datetime

def read_csv(file_name, team=None, services=None):
    teams = set()
    services_set = set()
    dates = []
    count_filtered_entries = 0

    with open(file_name, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            date = datetime.strptime(row['day'], '%Y-%m-%d %H:%M:%S.%f')
            dates.append(date)
            teams.add(row['Team'])

            service = row['Service'].split('--')[0].strip().lower()
            services_set.add(service)

            if team and services and row['Team'] == team and service in services:
                count_filtered_entries += 1

    return dates, teams, services_set, count_filtered_entries

def main():
    team = 'itcm'
    services = {
        'agreement-search',
        'agreement-masterdata',
        'api-management',
        'claims-backend',
        'attachment-ng',
        'comment-ui',
        'claims-submission-ui',
        'api-management-ui',
        'claims-submission-ui',
        'document library',
        'claims backend'
    }

    deployment_dates, deployment_teams, deployment_services, deployment_filtered_count = read_csv(
        'original_full_DF.csv', team, services)

    lead_time_dates, lead_time_teams, lead_time_services, lead_time_filtered_count = read_csv(
        'original_full_LTFC.csv', team, services)

    earliest_deployment_date = min(deployment_dates)
    latest_deployment_date = max(deployment_dates)
    earliest_lead_time_date = min(lead_time_dates)
    latest_lead_time_date = max(lead_time_dates)

    print(f"Deployment Frequency:")
    print(f"Earliest Date: {earliest_deployment_date}")
    print(f"Latest Date: {latest_deployment_date}")
    print(f"Teams: {sorted(deployment_teams)}")
    print(f"Services: {sorted(deployment_services)}")
    print(f"Number of 'itcm' entries with specified services: {deployment_filtered_count}")

    print(f"\nLead Time for Changes:")
    print(f"Earliest Date: {earliest_lead_time_date}")
    print(f"Latest Date: {latest_lead_time_date}")
    print(f"Teams: {sorted(lead_time_teams)}")
    print(f"Services: {sorted(lead_time_services)}")
    print(f"Number of 'itcm' entries with specified services: {lead_time_filtered_count}")

if __name__ == "__main__":
    main()
