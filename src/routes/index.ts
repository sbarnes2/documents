import * as express from "express";
import * as api from "./api";
import * as users from "./users";

export const register = (app : express.Application) =>{

    const usercontext = {
        name : "Sean Barnes",
        email : "sean.barnes@mybinxhealth.com",
        given_name: "Sean",
        family_name: "Barnes",
        zone_info:"BST"
    }

    // default route
    app.get("/",(req: any, res) =>{
        const user = usercontext;
        res.render('index',{isAuthenticated:true,user});
    });

    // documents
    app.get( "/documents", ( req: any, res ) => {
        const user = usercontext;
        res.render( "documents",{isAuthenticated:true,user} );
    } );

    api.register(app);
    users.register(app);

}