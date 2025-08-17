import { useState, useEffect } from "react";
import Table from "../ui/Table";
import UserModal from "./UserModal";
import { Role, User } from "@/types";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/constants";
import { toast } from "react-toastify";

export default function UserInfo() {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  // Initialize users data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch users
        const usersResponse = await apiClient<User[]>(
          API_ENDPOINTS.USERS.GET_ALL,
          { method: "GET" }
        );
        const formattedUsers = usersResponse.data.map((user) => ({
          ...user,
          birth_date: user.birth_date.split("T")[0],
        }));
        setUsers(formattedUsers);
        // Fetch roles
        const rolesResponse = await apiClient<Role[]>(
          API_ENDPOINTS.ROLES.GET_ALL,
          { method: "GET" }
        );
        setRoles(rolesResponse.data);

        setError(null);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : "An unknown error occurred";
        setError(errorMessage);
        toast.error(`Failed to load data: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique roles for filter options
  const uniqueRoles = [...new Set(users.map((user) => user.role))];

  // Filter users based on selected role
  const filteredUsers = selectedRole
    ? users.filter((user) => user.role === selectedRole)
    : users;

  // Handle opening the modal for adding a new user
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  // Handle opening the modal for editing an existing user
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await apiClient(API_ENDPOINTS.USERS.DELETE(userId), {
          method: "DELETE",
        });

        // Remove user from local state
        setUsers(users.filter((user) => user.id !== userId));
        toast.success("User deleted successfully");
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : "Failed to delete user";
        toast.error(errorMessage);
      }
    }
  };
  // Handle submitting the user form
  const handleSubmitUser = async (userData: {
    id?: number;
    name: string;
    email: string;
    role: string;
    phone: string;
    birthdate: string;
  }) => {
    try {
      if (userData.id) {
        // Update existing user
        const response = await apiClient<User>(
          API_ENDPOINTS.USERS.UPDATE(userData.id),
          {
            method: "PUT",
            body: JSON.stringify({
              name: userData.name,
              email: userData.email,
              role: userData.role,
              phone: userData.phone,
              birth_date: userData.birthdate,
            }),
          }
        );

        // Update user in local state
        setUsers(
          users.map((user) =>
            user.id === userData.id
              ? {
                  ...response.data,
                  birth_date: response.data.birth_date.split("T")[0],
                }
              : user
          )
        );
        toast.success("User updated successfully");
      } else {
        // Create new user
        const response = await apiClient<User>(API_ENDPOINTS.USERS.CREATE, {
          method: "POST",
          body: JSON.stringify({
            name: userData.name,
            email: userData.email,
            role: userData.role,
            phone: userData.phone,
            birth_date: userData.birthdate,
          }),
        });
        setUsers([
          ...users,
          {
            ...response.data,
            birth_date: response.data.birth_date.split("T")[0],
          },
        ]);
        toast.success("User created successfully");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : userData.id
          ? "Failed to update user"
          : "Failed to create user";
      toast.error(errorMessage);
    }
  };

  const handleCheckboxChange = (userId: number) => {
    setSelectedUserIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(userId)) {
        return prevSelectedIds.filter((id) => id !== userId);
      } else {
        return [...prevSelectedIds, userId];
      }
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUserIds(filteredUsers.map((user) => user.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSubmitAttendance = () => {
    console.log("Selected User IDs:", selectedUserIds);
    alert(`Selected User IDs: ${selectedUserIds.join(", ")}`);
  };

  return (
    <>
      <UserModal
        roles={roles}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitUser}
        user={
          selectedUser
            ? { ...selectedUser, birthdate: selectedUser.birth_date }
            : null
        }
        title={selectedUser ? "Edit User" : "Add New User"}
      />
      <Table
        title="User Info"
        actions={
          <div className="flex space-x-2">
            <button
              onClick={handleAddUser}
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-md"
            >
              Add User
            </button>
            <button
              onClick={handleSubmitAttendance}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Submit Attendance
            </button>
          </div>
        }
        filter={
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-white border border-gray-300 text-gray-600 py-1 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Roles</option>
            {uniqueRoles.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        }
        tableHeader={
          <>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Role
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Phone
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Birthdate
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <input
                type="checkbox"
                onChange={handleSelectAll}
                className="form-checkbox h-5 w-5 text-indigo-600 mr-2"
              />
            </th>
          </>
        }
        tableContent={
          <>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  Loading users...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-red-500">
                  Error: {error}
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="text-left hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.birth_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-indigo-600"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => handleCheckboxChange(user.id)}
                    />
                  </td>
                </tr>
              ))
            )}
          </>
        }
      />
    </>
  );
}
