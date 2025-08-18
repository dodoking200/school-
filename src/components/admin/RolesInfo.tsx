import { useState, useEffect } from "react";
import Table from "../ui/Table";
import RoleModal from "./RoleModal";
import { Role, Permission } from "@/types";
import { roleService } from "@/lib/services/roleService";

export default function RolesInfo() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isPermsOpen, setIsPermsOpen] = useState<boolean>(false);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const data = await roleService.getRoles();
      setRoles(
        (data as any[]).map((r) => ({
          id: r.id,
          name: r.name,
          permissions: Array.isArray((r as any).permissions)
            ? (r as any).permissions.map((p: any) => p.permission_name)
            : [],
          created_at: (r as any).created_at,
          updated_at: (r as any).updated_at,
        })) as Role[]
      );
    };
    fetchRoles();
  }, []);

  const handleAddRole = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleShowPermissions = async (role: Role) => {
    const perms = await roleService.getRolePermissions(role.id);
    setSelectedRole(role);
    setRolePermissions(perms.map((p) => p.name));
    setIsPermsOpen(true);
  };

  const handleSubmitRole = async (roleData: {
    id?: number;
    name: string;
    permissionIds: number[];
  }) => {
    if (roleData.id) {
      await roleService.updateRolePermissions(roleData.id, roleData.permissionIds);
    } else {
      await roleService.createRole(roleData.name, roleData.permissionIds);
    }
    const refreshed = await roleService.getRoles();
    setRoles(
      (refreshed as any[]).map((r) => ({
        id: r.id,
        name: r.name,
        permissions: Array.isArray((r as any).permissions)
          ? (r as any).permissions.map((p: any) => p.permission_name)
          : [],
        created_at: (r as any).created_at,
        updated_at: (r as any).updated_at,
      })) as Role[]
    );
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
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleShowPermissions(role)}
                  >
                    Show Roles
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    className="text-indigo-600 hover:text-indigo-900"
                    onClick={() => handleEditRole(role)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 ml-4"
                    onClick={async () => {
                      await roleService.deleteRole(role.id);
                      setRoles((prev) => prev.filter((r) => r.id !== role.id));
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </>
        }
      />

      {isPermsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedRole?.name} Permissions
              </h3>
              <button
                onClick={() => setIsPermsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {rolePermissions.length === 0 ? (
              <p className="text-sm text-gray-600">No permissions assigned.</p>
            ) : (
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800 max-h-64 overflow-auto">
                {rolePermissions.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsPermsOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
