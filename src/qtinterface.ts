import {Client, createClient } from 'Soap';

 // tslint:disable-next-line:no-console
console.log('up and running');
const username: string = 'training';
const password: string = 'Passw0rd!';


const authenticateUrl: string  = 'https://mybinxhealth.qt9app1.com/services/wsAuthenticate.asmx?wsdl';
const documentUrl: string  = 'https://mybinxhealth.qt9app1.com/services/wsDocuments.asmx?wsdl';

// tslint:disable-next-line:no-console
createClient(documentUrl,(err:Error,client:Client)=>{
    if(err){
        // tslint:disable-next-line:no-console
        console.log('error calling authenticate '+err?.message);
    } else {
        // tslint:disable-next-line:no-console
        console.log('soap connection ok');
        client.addSoapHeader({
            UserName:username,
            Password:password,
        })
        client.GetAllDocumentsAsDataSet(
            {
                IncludeInactive:false
            },(e:Error, res:any)=>
            {
                // tslint:disable-next-line:no-console
                console.log('error is '+e?.message);
                // tslint:disable-next-line:no-console
                console.log(`response is :${res}`);
            }
        )

        client.GetAllDocumentsAsDataSet(
            {
                UserName:username,
                Password:password,
                IncludeInactive:false
            },(e:Error, res:any)=>
            {
                // tslint:disable-next-line:no-console
                console.log('error is '+e?.message);
                // tslint:disable-next-line:no-console
                console.log(`response is :${res}`);
            }
        )
    }
});


