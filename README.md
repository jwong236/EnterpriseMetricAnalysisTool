# Enterprise Metric Analysis Tool (EMAT)

A data analysis tool to enhance productivity and developer experience by analyzing Scrum team metrics and visualizing trends. Developed as part of a UCI x SAP Capstone Project and demonstrated at UCI’s ICS fair, EMAT uses React (frontend) and Flask (backend) for a seamless, data-driven experience. For more details on our journey, research, and documentation, see the [Project Journey and Research](#project-journey-and-research) section.

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Screenshots and Demo](#screenshots-and-demo)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Data Disclaimer](#data-disclaimer)
- [Project Journey and Research](#project-journey-and-research)
- [Acknowledgments](#acknowledgments)

## About the Project

EMAT, developed in collaboration with SAP and inspired by DevOps frameworks such as DORA, SPACE, and DevEx, connects to SAP’s internal Hyperspace Portal, Jira, and GitHub to extract and analyze Scrum team metrics, generating valuable insights to enhance productivity. Using the DevEx framework, it offers insights to help Scrum teams enhance productivity, improve sprint velocity, and make data-driven decisions. An important part of the project involved determining which metrics to use and creating these metrics from scratch.

## Features

- **Data Integration**: Extracts and combines data from Hyperspace, Jira, and GitHub for comprehensive Scrum team analysis. (This repository uses fabricated data, see section [Data Disclaimer](#data-disclaimer))
- **Custom Metrics**: Includes newly created metrics inspired by and following the SPACE and DORA frameworks, as well as metrics imported from SAP's internal system, providing a comprehensive view of team performance.
- **Interactive visualization**: Displays key metrics using bar graphs for correlations and line graphs for metric fluctuations, helping teams explore productivity trends and identify bottlenecks. Visualizes interactions to support data-driven decision-making and improvement.
- **Adjustable Time Range**: Adjust data by date or sprint number to visualize past performance, compare sprints, and identify trends over time. This helps teams analyze historical data for better decision-making.

## Screenshots and Demo

Here’s a quick look at EMAT in action:

### Full Page Screenshot
![Fullpage Screenshot](https://github.com/user-attachments/assets/71df56a5-4580-4767-be3a-c55a682cf5d8)

### Interactive Demo
<details>
<summary>Click to view GIFs!</summary>

### Adjust Sprint Range (with sprint number or date)
![Recording2024-11-21233522-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/110e36a2-4a5b-4b5e-870a-8d24ddfcf90c)

### Correlations Bar Graph
![Recording2024-11-21233625-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/ce23284f-17b6-47b7-b8f8-a9981edb404f)

### Data Points Line Graph
![Recording2024-11-21233732-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/63438c05-fbfe-4175-b681-e28bb2bdaa67)

</details>

### Live Demo

[Click here to try the application yourself!](Linktodeployment) (Not activate yet)

## Installation

To run the EMAT application locally, follow these steps:

### 0. Prerequisites

- Python: Version 3.8 or higher
- Node.js: Version 16.x or higher
- npm: Version 8.x or higher
- Git: Most recent version

### 1. Clone the Repository

```sh
git clone https://github.com/jwong236/EnterpriseMetricAnalysisTool
```

### 2. Virtual Environment (Optional but recommended)

1. Create virtual environment

```sh
python -m venv env
```

2. Activate virtual environment:

- On Windows
  ```sh
  env/Scripts/activate
  ```
- On macOS/Linux:
  ```sh
  source env/bin/activate
  ```

### 3. Backend Setup

1. Navigate to the backend directory:

   ```sh
   cd backend
   ```

2. Install requirements:
   ```sh
   pip install -r requirements.txt
   ```
3. Start the Flask server:
   ```sh
   flask run
   ```

### 4. Frontend Setup

1. Open new terminal (If needed)
2. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## Usage

Navigate to the local development URL shown in your terminal, or copy and paste http://localhost:5173/ into your browser. You can also click the link directly.

## Technologies Used

- **Frontend**: Vite with React and JavaScript
- **Backend**: Flask and Python
- **Database**: CSV files

## Data Disclaimer

This project initially used data from SAP's internal systems. For the purpose of this demonstrative repository, all data is fabricated and generated from scripts to simulate real-world scenarios.

## Project Journey and Research

If you would like to see our project journey in more detail, including research methodology, documentation and presentations, here is a more in-depth dive:

- **UCI x SAP Capstone Project**: [EMAT_Overview](docs/EMAT_Overview.pdf) (In progress)

## Acknowledgments

Special thanks to the SAP teams for their support throughout the project, as well as our mentors Prof. Dr. Tobias Schimmer, Paige Perusset, and Julian Egbert
