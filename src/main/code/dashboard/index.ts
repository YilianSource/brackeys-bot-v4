import express from 'express';

export const start = function(port: number): Promise<void> {
    const app = express();
    
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    return new Promise(resolve => {
        app.listen(port, () => {
            resolve();
        });
    });
}