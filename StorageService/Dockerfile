FROM golang:1.23

WORKDIR /usr/src/app

COPY ./go.mod ./go.sum ./
RUN go mod download && go mod verify

COPY . .

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /run_app

# Optional:
# To bind to a TCP port, runtime parameters must be supplied to the docker command.
# But we can document in the Dockerfile what ports
# the run_application is going to listen on by default.
# https://docs.docker.com/reference/dockerfile/#expose
EXPOSE 9090

# Run
CMD ["/run_app"]