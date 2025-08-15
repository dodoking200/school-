import { useState, useEffect } from "react";
import Table from "../ui/Table";
import UserModal from "./UserModal";
import { User } from "@/types";


export default function UserInfo() {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  // Initialize users data
  useEffect(() => {
    setUsers([
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        role: "admin",
        phone: "(555) 111-1111",
        birth_date: "1990-01-01",
        created_at: "2023-01-01",
        updated_at: "2023-01-01",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "teacher",
        phone: "(555) 222-2222",
        birth_date: "1985-05-05",
        created_at: "2023-01-01",
        updated_at: "2023-01-01",
      },
      {
        id: 3,
        name: "Peter Jones",
        email: "peter.jones@example.com",
        role: "student",
        phone: "(555) 333-3333",
        birth_date: "2005-10-10",
        created_at: "2023-01-01",
        updated_at: "2023-01-01",
      },
      {
        id: 4,
        name: "Mary Williams",
        email: "mary.williams@example.com",
        role: "student",
        phone: "(555) 444-4444",
        birth_date: "2006-11-11",
        created_at: "2023-01-01",
        updated_at: "2023-01-01",
      },
    ]);
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

  // Handle submitting the user form
  const handleSubmitUser = (userData: {
    id?: number;
    name: string;
    email: string;
    role: string;
    phone: string;
    birthdate: string;
  }) => {
    const now = new Date().toISOString();
    if (userData.id) {
      // Update existing user
      setUsers(users.map(user =>
        user.id === userData.id ? { ...user, ...userData, birth_date: userData.birthdate, updated_at: now } : user
      ));
    } else {
      // Add new user with a new ID
      const newId = Math.max(0, ...users.map(u => u.id)) + 1;
      setUsers([...users, { ...userData, id: newId, birth_date: userData.birthdate, created_at: now, updated_at: now }]);
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitUser}
        user={selectedUser ? { ...selectedUser, birthdate: selectedUser.birth_date } : null}
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
            <input type="checkbox" onChange={handleSelectAll} className="form-checkbox h-5 w-5 text-indigo-600 mr-2" />
            Attendance
          </th>
        </>
      }
      tableContent={
        <>
          {filteredUsers.map((user) => (
            <tr
              key={user.id}
              className=" text-left hover:bg-gray-50 transition duration-150"
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
                <button
                  className="text-indigo-600 hover:text-indigo-900"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </button>
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
          ))}
        </>
      }
    />
    </>
  );
}
