import csv

def filter_csv(input_file_name, output_file_name, services):
    with open(input_file_name, mode='r') as input_file, open(output_file_name, mode='w', newline='') as output_file:
        reader = csv.DictReader(input_file)
        fieldnames = reader.fieldnames
        writer = csv.DictWriter(output_file, fieldnames=fieldnames)
        
        writer.writeheader()
        for row in reader:
            service_name = row['Service'].split('--')[0].strip().lower()
            if service_name in services:
                writer.writerow(row)

def main():
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

    filter_csv('original_full_DF.csv', 'filtered_DF.csv', services)
    filter_csv('original_full_LTFC.csv', 'filtered_LTFC.csv', services)

if __name__ == "__main__":
    main()
