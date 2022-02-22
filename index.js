
import logger from 'morgan';
import { parse } from 'url';

import WebSocketRoute, { callbackRoute, serveBootstrapRoute } from './routes/WebSocketRoute.js';
import HealthcheckRoute from './routes/HealthcheckRoute.js';

import express from 'express';
import expressStatic from 'express-static';
import process from 'process';


import axios from 'axios';
import FrontendRoute from './routes/FrontendRoute.js';

(function () {
    const app = express();
    app.use(logger('dev', {
        skip: function (req, res) {
            // console.log(req.url);
            if (req.url == '/health' || req.url == '/') {
                return true;
            } else {
                return false;
            }
        }
    }));

    app.use("/health", HealthcheckRoute);
        //callback:
        /* callbackApp.post("/cb/", (req, res) => {
            console.log("Machine ID " + req.params.machineId + " is ready");
            console.log(cbStack);
            cbStack[req.params.machineId].send(req.params.machineId);
            res.send("ok");
    
            delete cbStack[req.params.machineId];
        }); */

    app.get("/bootstrap", serveBootstrapRoute);

    app.post("/cb", express.urlencoded(), callbackRoute);

    //our http server which handles websocket proxy and static
    const PORT = process.env.WEBSOCKET_PORT ?? 8085;
    const server = app.listen(PORT, () => { console.log("[WebSocket] Listening to port " + PORT) });/*  */

    //bypass validation for now
    /**
     * @deprecated
     * @param {*} token 
     * @returns 
     */
    async function validateSession(token) {

        //if no authentication route is configured just bypass authentication
        if (!process.env.AUTHENTICATION_ROUTE) return true;

        // console.log(fetch);

        const serverResponse = await axios.post(process.env.AUTHENTICATION_ROUTE, { token: token });
        // const data = await serverResponse.json();
        console.log(serverResponse);

        return true;
    }

    WebSocketRoute(server, app);

    app.use(expressStatic('public'));
})();
