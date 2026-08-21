import AdminPage from "@/modules/admin/pages/AdminPage";

export const metadata = {
  title: "Admin Panel | StoryVN",
  description: "Trang quản lý người dùng và cấu hình hệ thống StoryVN dành cho quản trị viên.",
};

export default function AdminApp() {
  return <AdminPage />;
}
