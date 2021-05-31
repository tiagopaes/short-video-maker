import express from 'express';
import {webhook} from './bot';

const app = express();
const port = process.env.PORT || 8000;

app.post('webhook', webhook)

app.listen(port);
