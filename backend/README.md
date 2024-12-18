# Backend Guide

## Initial Setup


1. Install Python and Pip (if you don't have already):

```
sudo apt-get install python3 python3-pip
```

2. Install virtualenv:

```
pip install virtualenv
```

3. Setup a virtual environment in the backend folder:

```
virtualenv venv
source venv/bin/activate
```

4. Install project dependencies:

```
pip install -r requirements.txt
```

5. Migrate the database:

```
flask db init
flask db migrate
flask db upgrade
```

6. Run the Flask application:

```
python3 run.py
```

7. While the Flask app is running, open another terminal tab. Within the SDIL-Project/ folder, seed the database by running:

```
export FLASK_APP=run.py
flask seed-db
```

You only need to execute `export FLASK_APP=run.py` when you open a new terminal window (you don't have to do it in an old window).


## Making Changes to the Database

If you make any changes to the database layout, i.e., changes to `backend/models/models.py`, you need to proceed with the following steps.

1. Make sure that the sample data is still seeded correctly in `backend/seed.py`.

2. Make sure that the `flask` commands can recognize the flask app, by running this:

```
export FLASK_APP=run.py
```

3. Re-migrate the database again using this command (make sure your environment is activated):

```
flask db stamp head
flask db migrate
flask db upgrade
```

4. Run the flask application.

5. While the Flask app is running, open another terminal/ssh tab. Within the smart-greenhousy-plaenty/ folder, and activate the environment again. Then, seed the database by running:

```
export FLASK_APP=run.py
flask seed-db
```

Make sure your environment is activated also in the other tab.