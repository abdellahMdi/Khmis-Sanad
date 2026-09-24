import { useGetAdminUsersQuery } from '../../api/api';
import ErrorState from '../../components/ErrorState';
import Badge from '../../components/Badge';

export default function AdminUsersPage() {
    const { data, isError, refetch } = useGetAdminUsersQuery();
    const users = data?.data || [];

    if (!data && !isError) {
        return null;
    }
    if (isError) {
        return <ErrorState onRetry={refetch} />;
    }

    return (
        <div>
            <h1 className="text-2xl sm:text-3xl">Utilisateurs</h1>
            <div className="mt-6 overflow-x-auto rounded-xl bg-sable-50">
                <table className="min-w-full text-left text-sm">
                    <thead className="text-encre-muted">
                        <tr>
                            <th className="px-4 py-3">Nom</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Rôle</th>
                            <th className="px-4 py-3">Boutique</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-t border-encre/10">
                                <td className="px-4 py-3">
                                    {user.firstname} {user.lastname}
                                </td>
                                <td className="px-4 py-3">{user.email}</td>
                                <td className="px-4 py-3">
                                    <Badge>{user.role}</Badge>
                                </td>
                                <td className="px-4 py-3">
                                    {user.shop?.name || '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
