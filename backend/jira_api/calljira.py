# File to test making api calls to Jira
from jira.client import JIRA
from dotenv import load_dotenv
import base64
import json
import requests
import os

def call_api(jira: JIRA):
    try:
        print(jira.myself())
    except Exception as e:
        print("Myself call fail, ", e)
    
    try:
        print(jira.projects())
    except Exception as e:
        print("Projects call fail, ", e)

def authenticate_jira_wreq(request_url, user_email, api_token):
    try:
        print("Requesting Jira through requests.get")
        print(f"URL: {request_url}")
        print(f"email: {user_email}")
        print(f"token: {api_token}")
        headers = {
            'Authorization': f'Basic {base64.b64encode(bytes(f'{user_email}:{api_token}', 'utf-8')).decode('ascii')}',
            'Accept': 'application/json'
        }
        response = requests.get(request_url, auth=(user_email, api_token))
        print(f"Status code: {response.status_code}")
        print(response)
        print(response.content)
    except Exception as e:
        print("Failed requests", e)
        return None
    return response

def authenticate_jira_wlib(server, user_email, api_token):
    try:
        print("Requesting Jira through JIRA library")
        print(f"URL: {server}")
        print(f"email: {user_email}")
        print(f"token: {api_token}")
        jira = JIRA(server, token_auth=api_token)
        print("Connection success")
    except Exception as e:
        print("Failed to connect server: ", e)
        return None

    return jira

def main():
    load_dotenv()
    # server = os.getenv("SERVER")
    server = r"https://jira.tools.sap"
    user_email = os.getenv("USER_EMAIL")
    api_token = os.getenv("PAT_TOKEN")

    # api_direct = os.getenv("API_BOARD")
    api_direct = r"rest/api/2/myself"
    request_url = f"{server}/{api_direct}"
    if (response := authenticate_jira_wreq(request_url, user_email, api_token)) == None:
        return 1
    
    # if (jira := authenticate_jira_wlib(server, user_email, api_token)) == None:
    #     return 1
    # else:
    #     call_api(jira)
    print("main run finished")

if __name__ == "__main__":
    # main() -- DO NOT RUN ON NON-SAP ENVIRONMENT