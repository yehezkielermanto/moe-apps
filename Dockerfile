# Use the official Python image as the base image
FROM nikolaik/python-nodejs:latest

# initialize work dir
COPY . /app
WORKDIR /app

# Install the application dependencies
RUN npm install
RUN pip install -r requirements.txt

# Define the entry point for the container
EXPOSE 8000
CMD ["python", "manage.py", "runserver"]