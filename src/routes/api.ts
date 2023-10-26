import * as express from 'express';
import pgPromise,{ ParameterizedQuery } from 'pg-promise';
import { TypedRequestBody } from './users';

export const register = (app: express.Application) =>{
    const port = parseInt(process.env.PGPORT || "5432",10);

    const config = {
        database: process.env.PGDATABASE || "postgres",
        host: process.env.PGHOST || "localhost",
        port,
        user : process.env.PGUSER || "postgres"
    };

    const pgp  = pgPromise();
    const db = pgp(config);

    // documents
    app.get('/api/documents/all',async(req:any, res) => {
        try{
                const userId = 1;
                const documents = await db.any('SELECT * FROM documents order by documentnumber',);
                return res.json(documents);
            } catch (err){
                // tslint:disable-next-line:no-console
                console.error(err);
                res.json({error: err.message || err});
        }
    });

    app.get('api/documents/documentbytype/:type',async(req:express.Request,res)=>{
        try{

            // tslint:disable-next-line:no-console
            console.log('entering documentbytype');
        const documents = await db.any(`select * from documents where documentcode='${req.params.type}'`);
        return res.json(documents);
        }
        catch(err)
        {
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json({error: err.message || err});
        }
    });

    app.post('/api/documents/add',async (req:TypedRequestBody<{DocumentName:string,DocumentCode:string,DocumentType:string,DocumentNumber:string,RiskLevel:number}>, res) => {
        try{
                const {DocumentName,DocumentCode,DocumentType,DocumentNumber,RiskLevel} = req.body;
                const addDocument = new ParameterizedQuery({
                    text: 'INSERT INTO documents(DocumentName,DocumentCode,DocumentType,DocumentNumber,RiskLevel) values ($1,$2,$3,$4,$5) returning Id;',
                    values: [req.body.DocumentName,req.body.DocumentCode,req.body.DocumentType,req.body.DocumentNumber,req.body.RiskLevel]
                });
                const id = await db.one(addDocument);
                return res.json({id});
        } catch(err){
            // tslint:disable-next-line:no-console
            console.error(err);
            res.json({error: err.message || err});
        }
    });

    app.delete('/api/documents/remove/:id',async (req : any,res) => {
            try{
                    const id = await db.result(
                        'Delete from documents where id = $1',[req.params.id],(r :any) => r.rowCount);
                    return res.json({id});
            }   catch(err) {
                    // tslint:disable-next-line:no-console
                    console.error(err);
                    res.json({error: err.message || err});
            }

    })

    app.get('/api/documents/getdocumentsbyuserid/:userid',async (req:any,res) =>{
                    const query:string = `select u.id as userid,u.username,d.id,d.documentnumber,ts.usercurrentrevision as documentversion,ts.training_complete_date from training_status ts inner join documents d on ts.documentid = d.id inner join users u on ts.userid = u.id where  u.id = ${req.params.userid};`;

                    // tslint:disable-next-line:no-console
                    console.log(query);

                    const documentsbyuserid = await db.any(query,);

                    // tslint:disable-next-line:no-console
                    console.log(documentsbyuserid);
                    return(res.json(documentsbyuserid));
    });


    app.get('/api/documents/gettrainingupdates', async (req:any,res)=>{
        const query:string = 'select * from user_training_needed';
        const trainingneeded = await db.any(query,);
        return(res.json(trainingneeded));
    });
}
