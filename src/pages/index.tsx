import { trpc } from '@/lib/trpc';

const Test = () => {
  const {data, isError, isPending} = trpc.test.getAllUsers.useQuery();
  console.log(data)

  if(isError || isPending) {
    return (
      <div>
        <p>loading...</p>
      </div>
    );
  }

  return (
    <div>
      <ul>
      {data.map((user) => (
          <li key={user.id}>{user.email}</li>
      ))}
      </ul>
    </div>
  );

}

export default function App() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
    <p>index pg</p>
    <Test />
    </div>
  );
}

