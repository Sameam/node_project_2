# This project create using express_framework, with MongoDB. 

Requirements:

Node_js 15.0+
npm 

How to Start the Project:

Open the CMD/Terminal in the project2 folder

In window type in dir, in linux/mac type ls in terminal and press enter

Verify that you are inside the project 2 and can see app folder

**Set up an .env files** 
* This files is used to store all the important information. 

python -m venv venv (In window)
python3 -m venv venv (In mac/linux)
After installing the venv, activate the venv using the following command
source venv/bin/activate (In mac/linux)
venv\Scripts\activate (In window)
Install all the project requirment by entering the command
pip install -r requirements.txt (In windows)
pip3 install -r requirements.txt (In mac)
sudo pip3 install -r requirments.txt (In Linux)
There will need to be create a database first. To create a database:
flask db init
flask db migrate -m "name for the table"
flask db upgrade
To run the server type the command
flask run
Your Project will get start

It will give you the host address
Copy the address and paste it into your any favorite Browser
There are two panels inside the projects:

Admin
User
How To Create An Admin User

Run The Command
---->python createSuperUser.py(In windows)
---->sudo python3 createSuperUser.py (In Linux)
---->python3 createSuperUser.py (In Mac) Enter the details asked by the Command Prompt It will create a new super user.
How to run test cases. For testing, we first need to open init.py and change app.config.from_object(Config) to app.config.from_object('config.TestingConfig'). This will create a test.db which is a testing database.


