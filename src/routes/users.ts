import * as express from 'express';
import pgPromise,{ ParameterizedQuery } from 'pg-promise';


export interface TypedRequestBody<T> extends express.Request{
    body:T
}

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

    // Users
     app.get('/api/users/all',async (req:any, res) => {
            const users = await db.any('select * from users');
            return res.json(users);
    });

    app.get('/api/users/user/:userid',async (req:any, res)=>{
            const user = await db.any(`select * from users where id=${req.params.userid};`,);
            return res.json(user);
    });

    app.get('/api/users/getmanagers',async (req:express.Request,res)=>{
        return res.json({string:'no data'});
    });

    app.get('/api/users/getmanagersreports/:managerid',async (req:express.Request,res) => {
        const result = await db.any(`select u.id,u.username from users u inner join orgchart o on u.id = o.user_id where o.manager_id = ${req.params.managerid}`);
        return res.json(result);
    });


    app.get('/api/users/getusersmanager/:userid', async (req:any,res)=>{
        const manager = await db.any(`select u.* from orgchart o inner join users u on o.manager_id = u.id where user_id= ${req.params.userid}`,);
        return res.json(manager);
    });


    app.post('/api/users/addusertomanager',async (req:TypedRequestBody<{managerid:number,userid:number}>,res)=>{
        const success = await db.query(`insert into orgchart(manager_id,user_id) values(${req.body.managerid},${req.body.userid} returning id)`);
        return res.status(200).json(success);
    });

    app.post('/api/users/deleteuserfrommanager',async (req:TypedRequestBody<{managerid:number,userid:number}>,res) => {
        const success = await db.query(`delete from orgchart where manager_id = ${req.body.managerid} and user_id = ${req.body.userid}`);
        return res.status(200);
    });

}
