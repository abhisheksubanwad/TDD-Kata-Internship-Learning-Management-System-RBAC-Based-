import { useEffect, useState } from "react";
import api from "../api/axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  is_approved: boolean;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await api.get("/admin/users");
        setUsers(usersRes.data);

        const analyticsRes = await api.get("/admin/analytics");
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApproval = async (userId: string, approve: boolean) => {
    await api.patch(`/admin/mentors/${userId}`, { approve });
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_approved: approve } : u))
    );
  };

  if (loading) return <p>Loading admin dashboard...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Platform Analytics</h2>
      <p>Total Users: {analytics.totalUsers}</p>
      <p>Total Courses: {analytics.totalCourses}</p>
      <p>Total Completed Chapters: {analytics.completedCourses}</p>

      <h2 style={{ marginTop: "30px" }}>Users</h2>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Approved</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.is_approved ? "✅" : "❌"}</td>
                <td>
                  {user.role === "mentor" && !user.is_approved && (
                    <>
                      <button onClick={() => handleApproval(user.id, true)}>
                        Approve
                      </button>
                      <button onClick={() => handleApproval(user.id, false)}>
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;
