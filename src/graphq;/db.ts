// Plik db.ts dla celów testowych

// Typowanie danych użytkownika
interface User {
    id: string;
    name: string;
  }
  
  // Predefiniowane dane użytkowników
  const mockUsers: User[] = [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
  ];
  
  // Klient (fakcyjny) bazy danych, który zawsze zwraca te same dane
  class MockClient {
    query(query: string, params: any[]): Promise<any> {
      // Symulujemy zapytanie do bazy danych, zwracając dane użytkowników
      if (query.includes('SELECT')) {
        // Zwracamy użytkownika na podstawie ID
        const userId = params[0];
        const user = mockUsers.find(u => u.id === userId);
        return Promise.resolve({ rows: user ? [user] : [] });
      }
      if (query.includes('INSERT')) {
        // Symulujemy dodanie nowego użytkownika
        const newUser: User = { id: String(mockUsers.length + 1), name: params[0] };
        mockUsers.push(newUser);
        return Promise.resolve({ rows: [newUser] });
      }
      return Promise.reject(new Error('Unknown query'));
    }
  }
  export const connectToDatabase = ()=>{}
  // Eksport klienta
  export const client = new MockClient();
  