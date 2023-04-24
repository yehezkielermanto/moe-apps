# Use the official Python image as the base image
FROM nikolaik/python-nodejs:latest

# Set the working directory in the container
WORKDIR /app

# Copy the application files into the working directory
COPY . /app

RUN chmod 777 /app

# Install the application dependencies
RUN npm install
RUN pip install -r requirements.txt

# Define the entry point for the container
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]