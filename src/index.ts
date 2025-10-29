import express, { Application } from 'express';
import { config } from './config/config';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { loggerMiddleware } from './shared/logger';
import { registerUserRoutes } from './modules/user/infra/http/routes';


class App {
    public app: Application;
    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private initializeMiddlewares(): void {
        if(config.cors.enabled) {
            this.app.use(
                cors({
                    origin: config.cors.origin,
                    credentials: config.cors.credentials
                })
            )
        }

        const limiter = rateLimit({
            windowMs: config.rateLimit.windowMs,
            max: config.rateLimit.max,
            message: 'Too many requests from this IP'
        });

        this.app.use(limiter);
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(loggerMiddleware)
    }

    private initializeRoutes(): void {
        this.app.get('/health', (req, res) => {
            res.status(200).json({
                status: 'OK',
                service: config.app.name,
                version: config.app.version,
                timestamp: new Date().toISOString()
            });
        });

        registerUserRoutes(this.app);
        
    }

    private initializeErrorHandling(): void {

    }

    public listen(): void {
        this.app.listen(config.app.port, () => {
            console.log(`
                ========================================
                🚀 ${config.app.name} v${config.app.version}
                🌍 Environment: ${config.app.env}
                📡 Server running on port ${config.app.port}
                ========================================
            `);
        });
    }
}

const app = new App();
app.listen();

export default app.app;
