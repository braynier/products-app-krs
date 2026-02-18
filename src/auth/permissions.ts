export type UserRole = "Manager" | "Editor" | "Viewer";

export const currentUserRole: UserRole = "Manager";

function getProductPermissions(role: UserRole) {
  return {
    canEditProducts: role === "Manager" || role === "Editor",
    canDeleteProducts: role === "Manager",
    canCreateProducts: role === "Manager",
    isReadOnlyProducts: role === "Viewer",
  };
}

const productPermissions = getProductPermissions(currentUserRole);

export const canEditProducts = productPermissions.canEditProducts;
export const canDeleteProducts = productPermissions.canDeleteProducts;
export const canCreateProducts = productPermissions.canCreateProducts;
export const isReadOnlyProducts = productPermissions.isReadOnlyProducts;
