import nodemailer from 'nodemailer';
import pgPromise,{ ParameterizedQuery } from 'pg-promise';

const sendFrom:string = process.env.SMTPFROM;

type EmailDefinition = {
    from:string;
    to:string;
    subject:string;
    html:string;
};


const port = parseInt(process.env.PGPORT || "5432",10);

const config = {
    database: process.env.PGDATABASE || "postgres",
    host: process.env.PGHOST || "localhost",
    port,
    user : process.env.PGUSER || "postgres"
};

const pgp  = pgPromise();
const db = pgp(config);


const inform:EmailDefinition = {from:sendFrom,to:'',html:'<h1>Welcome</h1><p>That was easy!</p>',subject:'Training notification.'};
const warn:EmailDefinition = {from:sendFrom,to:'',html:'<h1>Welcome</h1><p>That was easy!</p>',subject:'Training certification late.'};
const overdue:EmailDefinition = {from:'',to:'',html:'<h1>Welcome</h1><p>That was easy!</p>',subject:'Training Overdue.'};

const emailVersions :EmailDefinition[] = [inform,warn,overdue];


function SendEmail(_to:string, _from: string, version:number){

    const emailToSend = emailVersions[version];
    emailToSend.to = _to;
    emailToSend.from = _from.startsWith('training')?sendFrom:_from;  // send in the managers name for overdue.

    const transport = nodemailer.createTransport({
        service: 'binxmail',
        auth:{
            user:process.env.SMTPUSER,
            pass:process.env.SPTPPASS
        }
    });

    transport.sendMail(emailToSend);

}

function CollateEmails(){

    // get a list of out of date training.
    // get warning level on each document/person. (reset if version has increased since last warning.)
    // warning levels same as email levels. if >1 then manager involved. cc manager. (or maybe generate a report in future)
    // collate list per person and send emails
    // record in database.
}