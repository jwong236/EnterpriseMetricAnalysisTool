import datetime
import csv
import random

def generate_bugcounts():
    sprint_start_date = datetime.date(2023, 1, 4)
    end_date = datetime.date(2024, 12, 31)


    with open("./BC_DD.csv", 'w', newline='') as f:
        csv_writer = csv.writer(f)
        csv_writer.writerow(["startDate", "endDate", "num_bugs"])

        while ( sprint_start_date < end_date ):

            # 40% chance of 1-6 days of no bugs in a row 
            gen_in_a_row = int(random.random() * 100)
            if gen_in_a_row < 40:
                for i in range(1 + int(random.random() * 6)):
                    if sprint_start_date < end_date:
                        sprint_end_date = sprint_start_date + datetime.timedelta(days=int(random.random() * 6))
                        csv_writer.writerow([sprint_start_date, sprint_end_date, 0])
                        sprint_start_date = sprint_end_date + datetime.timedelta(days=1)
            else: 
                # 20% chance of generating a high value (20-45) after not generating 0s in a row
                gen_highval = int(random.random() * 100)
                if gen_highval < 20:
                    sprint_end_date = sprint_start_date + datetime.timedelta(days=int(random.random() * 6))
                    csv_writer.writerow([sprint_start_date, sprint_end_date, 20 + int(random.random() * 26)])
                    sprint_start_date = sprint_end_date + datetime.timedelta(days=1)
                else:
                    # 80% generate value between 0 and 12
                    sprint_end_date = sprint_start_date + datetime.timedelta(days=6)
                    csv_writer.writerow([sprint_start_date, sprint_end_date, int(random.random() * 13)])
                    sprint_start_date = sprint_end_date + datetime.timedelta(days=1)

if __name__ == "__main__":
    generate_bugcounts()