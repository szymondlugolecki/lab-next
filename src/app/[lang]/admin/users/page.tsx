import { db } from "@/lib/db";
import { AdminTableUser, columns } from "./(components)/columns";
import { DataTable } from "./(components)/data-table";

async function getData(): Promise<AdminTableUser[]> {
  return db.query.usersTable.findMany({
    columns: {
      id: true,
      email: true,
      name: true,
      role: true,
      image: true,
      createdAt: true,
    },
    orderBy: (users, { desc }) => [desc(users.createdAt)],
  });

  // Fetch data from your API here.
  //   return [
  //     {
  //       id: "728ed52f",
  //       amount: 100,
  //       status: "pending",
  //       email: "m@example.com",
  //     },
  //     // ...
  //   ];
}

export default async function Page() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
