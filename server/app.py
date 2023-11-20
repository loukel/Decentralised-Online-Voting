from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
import os
from dotenv import load_dotenv

load_dotenv()  # This loads the .env file

class Base(DeclarativeBase):
  pass

app = Flask(__name__)

database_uri = os.environ.get('DATABASE_URI')
app.config['SQLALCHEMY_DATABASE_URI'] = database_uri

# Set up database
db = SQLAlchemy(model_class=Base)
db.init_app(app)


@app.route("/")
def index():
  return render_template('index.html')

if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)

