export const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
  
    const first = parts[0]?.charAt(0) || "";
  
    const second = parts[1]?.charAt(0) || "";
  
    return (first + second).toUpperCase();
  };