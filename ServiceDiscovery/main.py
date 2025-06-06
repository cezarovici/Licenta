# Importing all needed modules.
from flask import Flask, request
from service_registery import ServiceRegistry
import threading
# Creating the Flask application.
app = Flask(__name__)

# Creation of the Service registry.
service_registry = ServiceRegistry()

@app.route("/service", methods=["POST"])
def create():
    '''
        This function processes the registration requests.
    '''
    request_body = request.json
    response, status_code = service_registry.create(request_body)
    return response, status_code

@app.route("/service", methods=["GET"])
def read():
    '''
        This function processes the requests of getting information about services.
    '''
    request_body = request.get_json(silent=True)  # Allows for None if no JSON is provided
    if request_body and "services" in request_body:
        response, status_code = service_registry.read_some(request_body["services"])
    else:
        response, status_code = service_registry.read_all()
    return response, status_code

@app.route("/service", methods=["PUT"])
def update():
    '''
        This function processes the update requests.
    '''
    request_body = request.json
    response, status_code = service_registry.update(request_body)
    return response, status_code

@app.route("/service", methods=["DELETE"])
def delete():
    '''
        This function processes the delete requests.
    '''
    request_body = request.json
    response, status_code = service_registry.delete(request_body)
    return response, status_code

@app.route("/heartbeat/<service>", methods=["POST"])
def heartbeat(service):
    '''
        This function processes the heartbeat requests.
    '''
    response, status_code = service_registry.add_heartbeat(service)
    return response, status_code

# Starting up the processing of checking heartbeats.
threading.Thread(target=service_registry.check_heartbeats).start()

# Running the main service.
app.run()