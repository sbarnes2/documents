import dotenv from "dotenv";
import fs from 'fs-extra';
import {Client} from 'pg';



const init =async () => {
    //init environment vars
    dotenv.config();
    //create a db client 

    var client = new Client();

    try{
        console.log(`connecting client using password = ${process.env.PGPASSWORD}`);
        await client.connect();

        //read in the sql file used to initialise the db
        console.log('reading SQL file in ')
        const sql = await fs.readFile("./tools/initdb.pgsql",{encoding:"utf-8"});

        console.log('splitting into statements')
        //split the file into seperate statements
        const statements = sql.split(/;\s*$/m);
        console.log(`statements count = ${statements.length}`)

        for(const statement of statements)
        {
            console.log(statement);
            if(statement.length>3){
                await client.query(statement);
            }
        }
    } catch (err){
        console.log(err);
        throw err;
    } finally {
        await client.end();
    }
};


init().then(()=>{
    console.log("Finished");
}).catch((error)=>{
    console.log("Finished with errors "+ error);
});