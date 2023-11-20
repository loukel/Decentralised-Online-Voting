from flask import Blueprint, request
from server.controllers.poll_controller import get_polls, add_poll

poll_blueprint = Blueprint('poll_blueprint', __name__)

@poll_blueprint.route('/polls', methods=['GET'])
def polls_get():
    return get_polls()

@poll_blueprint.route('/polls', methods=['POST'])
def user_add():
    return add_poll(request.form)