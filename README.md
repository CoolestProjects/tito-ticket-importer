# Tito Ticket Importer for MYSQL

Tito is an excellent event ticketing platform and is available at http://ti.to

We need to perform analysis on this data so we wrote this simple script to import the data into our platform for modeling.

### Get the data from tito

Navigate to your tickets home page, then
  > Select Attendees > Click export > Download as CSV

### SQL

Run the following SQL to create the db table that will store the ticket information

```sql

CREATE TABLE tito_ticket (
  ticket_created_date DATETIME,
  ticket_last_updated_date DATETIME,
  ticket VARCHAR(500),
  ticket_full_name VARCHAR(255),
  ticket_first_name VARCHAR(255),
  ticket_last_name VARCHAR(255),
  ticket_email VARCHAR(255),
  ticket_company_name VARCHAR(255),
  ticket_phone_number VARCHAR(255),
  event VARCHAR(255),
  void_status VARCHAR(255),
  price  VARCHAR(255),
  discount_status VARCHAR(255),
  ticket_reference VARCHAR(255),
  unique_ticket_url VARCHAR(255),
  unique_order_url VARCHAR(255),
  order_reference VARCHAR(255),
  order_name VARCHAR(255),
  order_email VARCHAR(255),
  order_company_name VARCHAR(255),
  order_phone_number VARCHAR(255),
  order_discount_code VARCHAR(255),
  order_ip VARCHAR(255),
  order_created_date DATETIME,
  order_completed_date DATETIME,
  event_id  BIGINT,
  PRIMARY KEY ( ticket_reference )
);

```

### Environment variables required

You need to set the following env variables to run this, the event_id is  column we us to internally map it to one of our events. These variables should be setup inside the ``` run.sh ``` file

```bash
export MYSQL_HOST=localhost
export MYSQL_USERNAME=root
export MYSQL_PASSWORD=
export MYSQL_DB=
export MYSQL_PORT=
export EVENT_ID=1
export CSV_FILE="./tickets.csv"
```

### Running the code

Once the environment variables are setup you good to go and run the Importer by Running

```bash
./run.sh
```
