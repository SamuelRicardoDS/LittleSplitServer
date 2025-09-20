import express, { Application } from 'express';
import { config } from './config/config';

class App {
    public app: Application;
    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private initializeMiddlewares(): void {
        
    }
    private initializeRoutes(): void {
        
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
