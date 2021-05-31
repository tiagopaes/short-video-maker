import express from 'express';
import { webhook, bot } from './bot';

const app = express();
const port = process.env.PORT || 8000;

bot.launch();

app.post('webhook', webhook)

app.listen(port, () => console.log(`Server running on port ${port}`));
