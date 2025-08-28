import { useState, useEffect } from "react";
import Table from "../ui/Table";
import RoleModal from "./RoleModal";
import { Role } from "@/types";
import { roleService } from "@/lib/services/roleService";
import { AddColorIcon, EditColorIcon, DeleteColorIcon } from "@/components/icons/ColorfulIcons";

export default function RolesInfo() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isPermsOpen, setIsPermsOpen] = useState<boolean>(false);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await roleService.getRoles();
      type ApiPermission = { permission_id?: number; permission_name?: string };
      type ApiRole = {
        id: number;
        name: string;
        permissions?: ApiPermission[];
      };
      const apiRoles = data as unknown as ApiRole[];
      const mapped: Role[] = apiRoles.map((r) => ({
        id: r.id,
        name: r.name,
        permissions: Array.isArray(r.permissions)
          ? r.permissions
              .map((p) => p.permission_name || "")
              .filter((n): n is string => Boolean(n))
          : [],
      }));
      setRoles(mapped);
    } catch (error) {
      console.error("Failed to fetch roles", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch roles"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddRole = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleShowPermissions = async (role: Role) => {
    try {
      setError(null);
      const perms = await roleService.getRolePermissions(role.id);
      setSelectedRole(role);
      setRolePermissions(perms.map((p) => p.name));
      setIsPermsOpen(true);
    } catch (error) {
      console.error("Failed to fetch role permissions", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch role permissions"
      );
    }
  };

  const handleSubmitRole = async (roleData: {
    id?: number;
    name: string;
    permissionIds: number[];
  }) => {
    try {
      setError(null);
      if (roleData.id) {
        // update name first if changed
        await roleService.updateRoleName(roleData.id, roleData.name);
        await roleService.updateRolePermissions(
          roleData.id,
          roleData.permissionIds
        );
      } else {
        await roleService.createRole(roleData.name, roleData.permissionIds);
      }
      fetchRoles();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save role", error);
      setError(error instanceof Error ? error.message : "Failed to save role");
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
            className="btn-primary flex items-center gap-2"
          >
            <AddColorIcon size={18} />
            <span>Add Role</span>
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
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  Loading roles...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-red-500">
                  Error: {error}
                </td>
              </tr>
            ) : roles.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  No roles found
                </td>
              </tr>
            ) : (
              roles.map((role) => (
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
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center gap-2"
                        onClick={() => handleEditRole(role)}
                      >
                        <EditColorIcon size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center gap-2"
                        onClick={async () => {
                          try {
                            setError(null);
                            await roleService.deleteRole(role.id);
                            fetchRoles();
                          } catch (error) {
                            console.error("Failed to delete role", error);
                            setError(
                              error instanceof Error
                                ? error.message
                                : "Failed to delete role"
                            );
                          }
                        }}
                      >
                        <DeleteColorIcon size={16} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
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
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
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
