# Inspired by https://github.com/jennielees/flask-sqlalchemy-example/blob/master/models.py
from app import db
from datetime import datetime

class Poll(db.Model):
    __tablename__ = 'my_table'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    start_date_time = db.Column(db.DateTime, nullable=False)
    end_date_time = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, name, start_date_time, end_date_time):
        self.name = name
        self.start_date_time = start_date_time
        self.end_date_time = end_date_time

    def __repr__(self):
        return f"<{self.__class__.__name__}(id={self.id})>"