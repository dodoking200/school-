import { useState, useEffect } from "react";
import Table from "../ui/Table";
import RoleModal from "./RoleModal";
import { Role, Permission } from "@/types";

export default function RolesInfo() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useEffect(() => {
    setRoles([
      {
        id: 1,
        name: "Admin",
        permissions: ["view_users", "edit_users", "delete_users", "view_roles", "edit_roles", "delete_roles"],
        created_at: "2023-01-01",
        updated_at: "2023-01-01",
      },
      {
        id: 2,
        name: "Teacher",
        permissions: ["view_users", "edit_users"],
        created_at: "2023-01-01",
        updated_at: "2023-01-01",
      },
      {
        id: 3,
        name: "Student",
        permissions: ["view_users"],
        created_at: "2023-01-01",
        updated_at: "2023-01-01",
      },
    ]);
  }, []);

  const handleAddRole = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleSubmitRole = (roleData: {
    id?: number;
    name: string;
    permissions: Permission[];
  }) => {
    const now = new Date().toISOString();
    if (roleData.id) {
      setRoles(roles.map(role =>
        role.id === roleData.id ? { ...role, ...roleData, updated_at: now } : role
      ));
    } else {
      const newId = Math.max(0, ...roles.map(r => r.id)) + 1;
      setRoles([...roles, { ...roleData, id: newId, created_at: now, updated_at: now }]);
    }
  };

  return (
    <>
      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitRole}
        role={selectedRole}
        title={selectedRole ? "Edit Role" : "Add New Role"}
      />
      <Table
        title="Roles and Permissions"
        actions={
          <button
            onClick={handleAddRole}
            className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-md"
          >
            Add Role
          </button>
        }
        tableHeader={
          <>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Role Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Permissions
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </>
        }
        tableContent={
          <>
            {roles.map((role) => (
              <tr
                key={role.id}
                className=" text-left hover:bg-gray-50 transition duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {role.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {role.permissions.join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    className="text-indigo-600 hover:text-indigo-900"
                    onClick={() => handleEditRole(role)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </>
        }
      />
    </>
  );
}
