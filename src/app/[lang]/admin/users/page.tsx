import { db } from "@/lib/db";
import { AdminTableUser, columns } from "./(components)/columns";
import { DataTable } from "./(components)/data-table";

function fetchUsers() {
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
}

export default async function UsersPage() {
  const users = await fetchUsers();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={users} />
    </div>
  );
}
