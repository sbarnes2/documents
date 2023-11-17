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
            const users = await db.any('select u.*,o.manager_id,0 as team_id  from users u inner join orgchart o on o.user_id = u.id');
            return res.json(users);
    });


/*Get TEAM MEMBERS BASED ON MANAGER ID
select u.id,u.username,u.email_address,jt.name AS job_title
from users u
inner join orgchart o on o.user_id = u.id
inner join user_jobtitle uj ON uj.user_id = o.user_id
inner join job_titles jt on jt.id = uj.job_title_id
where o.manager_id = 21
*/

    app.get('/api/users/getmanageruserdetails/:managerid',async (req:any,res)=>{
        let sql = 'select u.id,u.username,u.email_address,jt.name AS job_title from users u ';
        sql = sql + 'inner join orgchart o on o.user_id = u.id ';
        sql = sql + 'inner join user_jobtitle uj ON uj.user_id = o.user_id ';
        sql = sql + 'inner join job_titles jt on jt.id = uj.job_title_id ';
        sql = sql + 'where o.manager_id ='+req.params.managerid;

        const user = await db.any(sql,);
        return res.json(user);
    });

/*
--Get TEAM MEMBERS BASED ON TEAM ID
Select t.name,u.id as userid,u.username,jt.name,tm.user_is_manager as manager
from users u
inner join team_members tm on tm.user_id = u.id
inner join teams t on t.id = tm.team_id
inner join user_jobtitle uj ON uj.user_id = u.id
inner join job_titles jt on jt.id = uj.job_title_id
where t.id =
order by tm.user_is_manager DESC ,u.id
*/

app.get('/api/users/getteammembers/:teamid',async (req:any,res)=>{
    let sql = 'Select t.name,u.id as userid,u.username,jt.name,tm.user_is_manager as manager from users u ';
    sql = sql + 'inner join team_members tm on tm.user_id = u.id ';
    sql = sql + 'inner join teams t on t.id = tm.team_id ';
    sql = sql + 'inner join user_jobtitle uj ON uj.user_id = u.id ';
    sql = sql + 'inner join job_titles jt on jt.id = uj.job_title_id ';
    sql = sql + `where t.id = ${req.params.teamid} `;
    sql = sql + 'order by tm.user_is_manager DESC ,u.id'

    const user = await db.any(sql,);
    return res.json(user);
});

/*GET ALL DOCUMENTS FOR A USER INCLUDE TRAINING LEVEL
select distinct u.ID,U.username,U.email_address,t.name,d.doc_id,d.documentname,d.documentnumber,UT.usercurrentrevision,UT.rev
from users u
inner join orgchart o on o.user_id = u.id
inner join team_members tm on tm.user_id = u.id
inner join teams t on tm.team_id = t.id
inner join user_jobtitle uj on uj.user_id = u.id
inner join job_documents jd on jd.job_id = uj.job_title_id
LEFT join documents d on CAST(d.doc_id as integer) = CAST(jd.doc_id as integer)
LEFT JOIN USER_TRAINING_NEEDED UT ON UT.documentqtid = D.documentnumber AND UT.userid = U.ID
where u.id = 35
order by u.id,d.do
*/


app.get('/api/users/getusertrainingdetails/:userid',async (req:any,res)=>{
    let sql = ' SELECT distinct u.ID as userid,U.username,U.email_address,t.name as team_name,jt.name as job_title,d.doc_id,d.documentname,d.documentnumber,UT.usercurrentrevision,UT.rev from users u ';
    sql = sql + 'inner join orgchart o on o.user_id = u.id ';
    sql = sql + 'inner join team_members tm on tm.user_id = u.id ';
    sql = sql + 'inner join teams t on tm.team_id = t.id ';
    sql = sql + 'inner join user_jobtitle uj on uj.user_id = u.id ';
    sql = sql + 'inner join job_titles jt on jt.id = uj.job_title_id ';
    sql = sql + 'inner join job_documents jd on jd.job_id = uj.job_title_id ';
    sql = sql + 'LEFT join documents d on CAST(d.doc_id as integer) = CAST(jd.doc_id as integer) ';
    sql = sql + 'LEFT JOIN USER_TRAINING_NEEDED UT ON UT.documentqtid = D.documentnumber AND UT.userid = U.ID ';
    sql = sql + `where u.id = ${req.params.userid} `;
    sql = sql + 'order by u.id,d.doc_id;';

    const user = await db.any(sql,);
    return res.json(user);
});

/* GET ALL JOB Documents

select distinct t.id as team_id,t.name as team_name,jt.id as Job_id,jt.name as job_title,d.doc_id,d.documentnumber,d.documentname
from job_titles  jt
inner join  job_documents jd on jt.id = jd.job_id
inner join documents d on  CAST(jd.doc_id as integer) = CAST(d.doc_id as integer)
inner join teams t on t.id = jt.team_id
where jt.id = 4*/

app.get('/api/users/getjobdocuments/:jobid',async (req:any,res)=>{
    let sql = ' select distinct t.id as team_id,t.name as team_name,jt.id as Job_id,jt.name as job_title,d.doc_id,d.documentnumber,d.documentname from job_titles jt ';
    sql = sql + 'inner join job_documents jd on jt.id = jd.job_id ';
    sql = sql + 'inner join documents d on  CAST(jd.doc_id as integer) = CAST(d.doc_id as integer) ';
    sql = sql + 'inner join teams t on t.id = jt.team_id ';
    sql = sql + `where jt.id = ${req.params.jobid} `;
    sql = sql + 'order by d.doc_id;';

    const user = await db.any(sql,);
    return res.json(user);
});

    app.get('/api/users/user/:userid',async (req:any, res)=>{
            const user = await db.any(`select * from users where id=${req.params.userid};`,);
            return res.json(user);
    });

    app.get('/api/users/getmanagers',async (req:express.Request,res)=>{
        const result = await db.any(`select distinct u.* from users u inner join orgchart o on o.manager_id = u.id order by u.surname;`);
        return res.json(result);
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

// POST

    // Generic CREATE

/*     app.post('',async (req:TypedRequestBody<{}>,res)=>{
        try{
            const {} = req.body;
            const add = new ParameterizedQuery({
                text:'',
                values:[]});
            const id = await db.one(add);

        } catch(err){
            res.json(err).status(400);
        }
    }); */


    // USERS - CREATE

    app.post('/api/users/createuser', async (req:TypedRequestBody<{user_name:string,email_address:string,firstname:string,surname:string}>,res)=>{
        try{
                const {user_name,email_address,firstname,surname} = req.body;
                const addUser = new ParameterizedQuery({
                    text: 'INSERT INTO users(username,email_address,firstname,surname) values ($1,$2,$3,$4) returning Id;',
                    values: [req.body.user_name,req.body.email_address,req.body.firstname,req.body.surname]});
                const id = await db.one(addUser);
                return res.json({id});
        } catch(err){
            res.json(err);
                }
    });

    // JOB TITLE / TEAM - CREATE

    app.post('/api/users/createnewteamjob',async (req:TypedRequestBody<{team_id:number,name:string}>,res)=>{
        try{
            const {team_id,name} = req.body;
            const add = new ParameterizedQuery({
                text:'insert into job_titles (team_id,name) values {$1,$2} returning id;',
                values:[team_id,name]});
            const id = await db.one(add);

        } catch(err){
            res.json(err).status(400);
        }
    });

    // JOB TITLE / DOCUMENT - CREATE


    app.post('/api/users/adddocumenttojobtitle',async (req:TypedRequestBody<{document_id:number,job_title_id:number}>,res)=>{
        try{
            const {document_id,job_title_id} = req.body;
            const add = new ParameterizedQuery({
                text:'insert into job_documents (doc_id,job_id) values {$1,$2} returning id;',
                values:[document_id,job_title_id]});
            const id = await db.one(add);

        } catch(err){
            res.json(err).status(400);
        }
    });

    // TEAM - CREATE

    app.post('/api/users/createteam',async (req:TypedRequestBody<{name:string}>,res)=>{
        try{
            const {name} = req.body;
            const add = new ParameterizedQuery({
                text:'INSERT INTO TEAMS (name) values ($1) returning Id;',
                values:[req.body.name]});
            const id = await db.one(add);

        } catch(err){
            res.json(err).status(400);
        }
    });


    // USER _ TEAM ADD USER TO TEAM

    app.post('/api/users/addusertoteam',async (req:TypedRequestBody<{user_id:number,team_id:number,manager:boolean}>,res)=>{
        try{
            const {user_id,team_id,manager} = req.body;
            const add = new ParameterizedQuery({
                text:'INSERT INTO TEAM_MEMBERS (user_id,user_is_manager,team_id) values ($1,$2,$3) returning id;',
                values:[req.body.user_id,req.body.manager,req.body.team_id]});
            const id = await db.one(add);

        } catch(err){
            res.json(err).status(400);
        }
    });

    app.post('/api/users/deleteuserfrommanager',async (req:TypedRequestBody<{managerid:number,userid:number}>,res) => {
        const success = await db.query(`delete from orgchart where manager_id = ${req.body.managerid} and user_id = ${req.body.userid}`);
        return res.status(200);
    });

    app.post('/api/users/updateuserdocument',async (req:TypedRequestBody<{userid:string,documentid:string,newrevision:string}>,res) => {
        // fill in query here + add all required fields to the body, new rev number, documentid (not qt9 id)
        const success = await db.query(`update training_status set usercurrentrevision=${req.body.newrevision} ,trainingcomplete=true,training_complete_date = NOW() where userid = '${req.body.userid}' and documentid='${req.body.documentid}'`);
        return res.status(200);
    })


    app.post('',async (req:TypedRequestBody<{managerid:number,userid:number}>,res:any)=>{
        try {
                const {userid,managerid} = req.body;
                const success = await db.one(`insert into orgchart(user_id,manager_id) values(${req.body.userid},${req.body.managerid}) returning id;`);
                return res.json(success);
        } catch(err){
            res.json(err).status(400);
        }
    })

}
