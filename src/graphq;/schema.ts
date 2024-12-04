import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';
import { client } from './db';  // Importujemy klienta bazy danych

// Typ danych
interface User {
  id: string;
  name: string;
}

// Definiowanie typu User
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  },
});

// Zapytanie główne - pobieranie użytkownika
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args): Promise<User | null> {
        return client.query('SELECT * FROM users WHERE id = $1', [args.id])
          .then(res => res.rows[0] || null);
      },
    },
  },
});

// Mutacja - dodawanie użytkownika
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
      },
      resolve(parent, args): Promise<User> {
        return client.query('INSERT INTO users (name) VALUES ($1) RETURNING *', [args.name])
          .then(res => res.rows[0]);
      },
    },
  },
});

// Subskrypcje - przykładowe powiadomienie
const Subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    userUpdated: {
      type: UserType,
      resolve(): User {
        return { id: '1', name: 'Updated User' }; // Przykładowe dane
      },
    },
  },
});

// Tworzymy schemat GraphQL
export const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
  subscription: Subscription,
});
