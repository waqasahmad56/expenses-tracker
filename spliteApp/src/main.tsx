import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { ToastContainer } from 'react-toastify';
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ToastContainer/>
    </QueryClientProvider>
  </React.StrictMode>
);














































































// /// backend/src/interfaces/group.interface.ts
// export interface IGroup {
//   id: string;
//   name: string;
//   users: string[];
// }

// /// backend/src/interfaces/expense.interface.ts
// export interface IExpense {
//   id: string;
//   groupId: string;
//   payerId: string;
//   amount: number;
//   splitAmong: string[];
//   createdAt: Date;
// }



// /// frontend/src/App.tsx
// import { QueryClient, QueryClientProvider } from 'react-query';
// import Groups from './pages/Groups';

// const queryClient = new QueryClient();

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <div>
//         <h1>Group Expense Splitter</h1>
//         <Groups />
//       </div>
//     </QueryClientProvider>
//   );
// }

// export default App;
