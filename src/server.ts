import express, { Application } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './graphq;/schema';
import { connectToDatabase } from './graphq;/db';
import { startWebSocketServer } from './graphq;/subscriptions';

const app: Application = express();
const port: number = 3000;

// Połączenie z bazą danych
connectToDatabase();

// Używamy express-graphql do obsługi GraphQL
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

// Uruchamiamy serwer WebSocket dla subskrypcji
startWebSocketServer(app);

// Uruchamiamy serwer Express
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/graphql`);
});

export const mainapp=app;
