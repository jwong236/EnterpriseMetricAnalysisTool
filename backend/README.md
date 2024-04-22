# Set up virtual environment (python)
Run the following to create a virtual environment (name it anything and put it in .gitignore -- mine is named 'virtenv')
> python -m venv venvname

To activate virtual environment on Windows:  
> ./venvname/Scripts/activate.bat

For Mac:  
> source venvname/bin/activate  

Install required libraries
> pip install -r requirements.txt  

Deactivate virtual environment (when you're done)
> deactivate