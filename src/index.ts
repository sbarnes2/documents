import dotenv from "dotenv";
import express from "express";
import path from "path";
import * as routes from "./routes";



// enable the environment variables.
dotenv.config();
// get the port number to listen on.
const port = process.env.SERVER_PORT; // default port to listen

// create the express application instance.
const app = express();

// Configure the application to parse json.
app.use(express.json());
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