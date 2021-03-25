import sirv from "sirv";
import polka from "polka";
import compress from "compression";
import { json } from "body-parser";
import * as fs from "fs";
import { resolve } from 'path';

let app;

export default function serve(opts) {
    const dev = opts.dev || false;
    const host = opts.host;
    const port = opts.port;
    const authentication = opts.authentication;

    const indexFile = fs.readFileSync(resolve(opts.publicPath, 'index.html'));

    async function logger(req, _res, next) {
        console.log(`~> Received ${req.method} on ${req.url}`);
        next(); // move on
    }

    async function login(req, res) {
        const password = req.body?.password;

        if (!password || password !== authentication.password) return (res.statusCode = 401, res.end());

        res.end(JSON.stringify({
            "accessToken": authentication.token
        }));
    }

    async function authenticate(req, res, next) {
        const token = req.query.token;
        const basePath = req.url.split('/')[1];

        if (authentication.privatePaths.includes(basePath)) {
            if (token !== authentication.token) {
                return (res.statusCode = 403, res.end());
            }
        }

        next();
    }

    async function validToken(req, res) {
        const token = req.body?.token;

        let valid = false;

        if (token === authentication.token) {
            valid = true;
        }

        res.end(JSON.stringify({
            "valid": valid,
        }));
    }

    return {
        name: 'appserver',
        async writeBundle() {
            if (app) {
                app.server.close();
            } else {
                closeServerOnTermination();
            }

            const serveAssets = sirv(opts.publicPath, {
                maxAge: 31536000, // 1Y
                immutable: true,
                dev: dev,
            });

            app = polka({
                onNoMatch: (_req, res) => {
                    res.writeHead(200, { 'content-type': 'text/html' });
                    res.write(indexFile);
                    res.end();
                }
            })
                .use(json(), compress(), logger, authenticate, serveAssets)
                .get('/')
                .post('/login', login)
                .post('/validToken', validToken)
                .listen({
                    host: host,
                    port: port,
                }, err => {
                    if (err) throw err;
                    console.log(`> Ready on ${host}:${port}`);
                });
        }
    }
}

function closeServerOnTermination() {
    const terminationSignals = ['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGHUP']
    terminationSignals.forEach(signal => {
        process.on(signal, () => {
            if (app) {
                app.server.close()
                process.exit()
            }
        })
    })
}