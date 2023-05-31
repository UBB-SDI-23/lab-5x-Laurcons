FROM python:3.10

WORKDIR /code
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY dmp/ dmp/
COPY main.py main.py

CMD python main.py