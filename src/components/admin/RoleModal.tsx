import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Role } from "@/types";
import { roleService } from "@/lib/services/roleService";
import { cn } from "@/lib/utils";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roleData: {
    id?: number;
    name: string;
    permissionIds: number[];
  }) => void;
  role: Role | null;
  title: string;
}

export default function RoleModal({
  isOpen,
  onClose,
  onSubmit,
  role,
  title,
}: RoleModalProps) {
  const [name, setName] = useState("");
  const [allPermissions, setAllPermissions] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>(
    []
  );

  useEffect(() => {
    const init = async () => {
      const perms = await roleService.getAllPermissions();
      setAllPermissions(perms);
      if (role) {
        setName(role.name);
        const rolePerms = await roleService.getRolePermissions(role.id);
        setSelectedPermissionIds(rolePerms.map((p) => p.id));
      } else {
        setName("");
        setSelectedPermissionIds([]);
      }
    };
    if (isOpen) init();
  }, [role, isOpen]);

  const togglePermission = (id: number) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id: role?.id, name, permissionIds: selectedPermissionIds });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Animated Background Blur */}
        <motion.div
          initial={{ backdropFilter: "blur(0px)" }}
          animate={{ backdropFilter: "blur(20px)" }}
          exit={{ backdropFilter: "blur(0px)" }}
          className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/30 to-indigo-900/20"
        />
        
        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl"
        >
          <div
            className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-2xl border border-white/20 dark:border-gray-700/20 rounded-3xl shadow-2xl p-8"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
            }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-between items-center mb-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-3 h-8 bg-gradient-primary rounded-full" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Configure role permissions</p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-800/30 flex items-center justify-center transition-colors duration-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </motion.button>
            </motion.div>
            {/* Form Content */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Role Name Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  🗺️ Role Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="modern-input"
                  placeholder="Enter role name (e.g., Admin, Teacher)"
                  required
                />
              </motion.div>
              {/* Permissions Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  🔒 Permissions
                </label>
                <div className="max-h-64 overflow-auto bg-white/5 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/20 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {allPermissions.map((permission) => (
                      <motion.label 
                        key={permission.id} 
                        className="flex items-center space-x-3 py-2 px-3 rounded-xl hover:bg-white/10 dark:hover:bg-gray-700/20 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissionIds.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          className="w-4 h-4 text-primary bg-transparent border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-primary dark:focus:ring-primary focus:ring-2"
                        />
                        <span className="text-gray-700 dark:text-gray-200 font-medium text-sm">
                          {permission.name}
                        </span>
                      </motion.label>
                    ))}
                  </div>
                </div>
              </motion.div>
              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-end gap-4 pt-6 border-t border-white/10 dark:border-gray-700/20"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/20 rounded-2xl font-semibold text-gray-700 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-700/30 transition-all duration-200 backdrop-blur-sm"
                >
                  ❌ Cancel
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-8 py-3 bg-gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  ✨ Save Role
                </motion.button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
