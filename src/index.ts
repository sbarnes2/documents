import dotenv from "dotenv";
import express,{ Express }from "express";
import cors from 'cors';
import morgan from 'morgan';
import path from "path";
import * as routes from "./routes";



// enable the environment variables.
dotenv.config();
// get the port number to listen on.
const port = process.env.SERVER_PORT; // default port to listen

// create the express application instance.
const app = express();
app.use(morgan('dev'));

// Configure the application to parse json.
app.use(express.json());

// Add CORS support
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','origin,X-Requested-With,Content-Type,Accept,Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','GET,PATCH,DELETE,POST,PUT');
        return res.status(200).json({});
    }
    next();
});

// Configure Express to use EJS
/* app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" ); */


app.use( express.static( path.join( __dirname, "public" ) ) );

routes.register(app);

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );