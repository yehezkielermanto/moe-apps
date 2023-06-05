# # Use the official Python image as the base image
# FROM nikolaik/python-nodejs:latest

# # initialize work dir
# WORKDIR /app
# COPY . /app

# # Install the application dependencies
# RUN npm install
# RUN pip install -r requirements.txt

# # Define the entry point for the container
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

FROM ubuntu:18.04

RUN dpkg --configure -a

ENV PYTHON_VERSION 3.7.7
ENV PYTHON_PIP_VERSION 20.1
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get -y install nodejs npm \
    python-pip python3 curl && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_VERSION=16.13.2
RUN curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
# RUN nvm install 16.13.2

COPY . /app
WORKDIR /app
RUN npm install
RUN pip install -r requirements.txt

EXPOSE 8000
CMD ["python", "manage.py runserver"]