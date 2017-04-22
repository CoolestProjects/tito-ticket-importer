const csv=require('csvtojson');

var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : process.env['MYSQL_HOST'] || "localhost",
  user            : process.env['MYSQL_USERNAME'] || "root",
  password        : process.env['MYSQL_PASSWORD'] || "",
  database        : process.env['MYSQL_DB'] || "",
  port            : process.env['MYSQL_PORT'] || 3306,
});

var eventId = process.env['EVENT_ID'] || 1;
const csvFilePath = process.env['CSV_FILE'] || "./tickets.csv";

var tickets = [];
var ticketNo = 0;

function loadTickets() {
  csv()
    .fromFile(csvFilePath)
    .on('json',(ticket)=>{
      tickets.push(transformJsonFieldNames(ticket));
    })
    .on('done',(error)=>{
        console.log('end ' + tickets.length);
        insertNextTicket();
    });
}

//remove spaces and make the file names lower case
function transformJsonFieldNames(ticket) {
  for (var property in ticket) {
      var new_property = property.split(' ').join('_').toLowerCase();
      ticket[new_property] = ticket[property];
      delete ticket[property]
  }
  return ticket;
};

function insertNextTicket() {
  if(ticketNo < tickets.length) {
      var ticket = tickets[ticketNo];
      ticket.event_id=eventId;
      pool.query('INSERT INTO `tito_ticket` (`ticket_created_date`, `ticket_last_updated_date`, `ticket`, `ticket_full_name`, '+
        ' `ticket_first_name`, `ticket_last_name`, `ticket_email`, `ticket_company_name`, `ticket_phone_number`, `event`, '+
        '`void_status`, `price`, `discount_status`, `ticket_reference`, `unique_ticket_url`, `unique_order_url`, '+
        '`order_reference`, `order_name`, `order_email`, `order_company_name`, `order_phone_number`, `order_discount_code`, '+
        '`order_ip`, `order_created_date`,`order_completed_date`, `event_id`)' +
        ' VALUES ' +
        '("'+ticket.ticket_created_date+'","'+ticket.ticket_last_updated_date+'","'+ticket.ticket+'","'+ticket.ticket_full_name+'","'+
           ticket.ticket_first_name+'","'+ticket.ticket_last_name+'","'+ticket.ticket_email+'","'+ticket.ticket_company_name+'","'+ticket.ticket_phone_number+'","'+ticket.event+'","'+
          ticket.void_status+'","'+ticket.price+'","'+ticket.discount_status+'","'+ticket.ticket_reference+'","'+ticket.unique_ticket_url+'","'+ticket.unique_order_url+'","'+
          ticket.order_reference+'","'+ticket.order_name+'","'+ticket.order_email+'","'+ticket.order_company_name+'","'+ticket.order_phone_number+'","'+ticket.order_discount_code+'","'+
          ticket.order_ip+'","'+ticket.order_created_date+'","'+ticket.order_completed_date+'","'+ticket.event_id+'") ON DUPLICATE KEY UPDATE ticket_reference=ticket_reference;'
    , ticket, function (error, results, fields) {
        if (error) {
          console.log(error);
        } else {
          console.log("Inserted record " + ticketNo + " of " + tickets.length);
        }
        ticketNo = ticketNo+1;
        insertNextTicket();
      });
    } else {
      process.exit(1);
    }
}

loadTickets();
