import UserTable from './UserTable';
import Link from 'next/link';
import clientPromise from '@/lib/db';

interface UsersPageProps {
  searchParams: {
    page?: string;
    search?: string;
  };
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const page = parseInt(searchParams.page || '1');
  const limit = 10;
  const skip = (page - 1) * limit;
  const searchTerm = searchParams.search || '';

  const client = await clientPromise;
  const db = client.db();

  let usersQuery = {};
  if (searchTerm) {
    usersQuery = {
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { slug: { $regex: searchTerm, $options: 'i' } }
      ]
    };
  }

  const users = await db.collection('users')
    .find(usersQuery)
    .skip(skip)
    .limit(limit)
    .toArray();

  const totalUsers = await db.collection('users').countDocuments(usersQuery);
  const totalPages = Math.ceil(totalUsers / limit);

  const usersWithStrings = users.map(user => ({
    ...user,
    _id: user._id.toString(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  }));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User List</h1>
        <Link
          href="/admin/users/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add User
        </Link>
      </div>

      <UserTable
        users={usersWithStrings}
        currentPage={page}
        totalPages={totalPages}
        searchTerm={searchTerm}
        onSearchChange={() => {}}
      />
    </div>
  );
}