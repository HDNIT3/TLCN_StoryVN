import ClientLayout from "@/modules/client/common/layouts/ClientLayout";
import RegisterPage from "@/modules/auth/pages/RegisterPage";

export const metadata = {
  title: "Đăng ký tài khoản | StoryVN",
  description: "Tạo tài khoản mới tại StoryVN để cùng đọc truyện, lưu tủ sách cá nhân hoặc sáng tác tác phẩm mới.",
};

export default function RegisterApp() {
  return (
    <ClientLayout>
      <RegisterPage />
    </ClientLayout>
  );
}
