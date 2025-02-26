# Backend Guide

## Initial Setup

1. Install Python and Pip (if you don't have already):
    - For Linux:

    ```
    sudo apt-get install python3 python3-pip
    ```
    - For Windows:

      Download Python and Pip [here](https://www.python.org/downloads/windows/).
      Verify installation by running:
    ```
    python --version
    pip --version
    ```

2. Install virtualenv:

```
pip install virtualenv
```

3. Setup a virtual environment in the backend folder:
    - For Linux:

    ```
    virtualenv venv
    source venv/bin/activate
    ```

    - For Windows:
    
    ```
    python -m venv venv
    venv\Scripts\activate
    ```

4. Install project dependencies:

```
pip install -r requirements.txt
```

5. Set up an OpenAI API key:
- Create an `.env` file in the root directory
- Create an API key from your [OpenAI account](https://platform.openai.com/signup/)
- Add the API key to the  `.env` file in the following format:

```plaintext
OPENAI_API_KEY='your_openai_api_key'
```

6. Migrate the database:

    - For Linux:
     ```
    export FLASK_APP=run.py
    flask db init
    flask db migrate
    flask db upgrade
    ```

    - For Windows:
     ```
    set FLASK_APP=run.py
    flask db init
    flask db migrate
    flask db upgrade
    ```

7. Run the Flask application:

    - For Linux:
     ```
    python3 run.py
    ```

    - For Windows:
     ```
    python run.py
    ```

8. While the Flask app is running, open another terminal tab. Within the SDIL-Project/ folder, seed the database by running:
    - For Linux:
     ```
    export FLASK_APP=run.py
    flask seed-db
    ```

    - For Windows:
     ```
    set FLASK_APP=run.py
    flask seed-db
    ```

You only need to execute `export FLASK_APP=run.py` / `set FLASK_APP=run.py` when you open a new terminal window (you don't have to do it in an old window).


## Making Changes to the Database

If you make any changes to the database layout, i.e., changes to `backend/models/models.py`, you need to proceed with the following steps.

1. Make sure that the sample data is still seeded correctly in `backend/seed.py`.

2. Make sure that the `flask` commands can recognize the flask app, by running this:

    - For Linux:
     ```
    export FLASK_APP=run.py
    ```

    - For Windows:
     ```
    set FLASK_APP=run.py
    ```

3. Re-migrate the database again using this command (make sure your environment is activated):

```
flask db stamp head
flask db migrate
flask db upgrade
```

4. Run the flask application.

5. While the Flask app is running, open another terminal/ssh tab. Within the SDIL-Project / folder, and activate the environment again. Then, seed the database by running:

    - For Linux:
     ```
    export FLASK_APP=run.py
    flask seed-db
    ```

    - For Windows:
     ```
    set FLASK_APP=run.py
    flask seed-db
    ```

Make sure your environment is activated also in the other tab.
