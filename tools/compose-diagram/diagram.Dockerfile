FROM python:3.12-bullseye

RUN apt update -y && apt upgrade -y

RUN apt install -y graphviz

RUN pip install --no-cache-dir docker-compose-diagram

WORKDIR /app

CMD [ "sh", "-c", "compose-diagram --file /app/docker-compose.yaml --direction=TB --nodesep=1.5" ]