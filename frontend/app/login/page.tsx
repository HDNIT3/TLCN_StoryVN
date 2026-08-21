import ClientLayout from "@/modules/client/common/layouts/ClientLayout";
import LoginPage from "@/modules/auth/pages/LoginPage";

export const metadata = {
  title: "Đăng nhập | StoryVN",
  description: "Đăng nhập vào tài khoản StoryVN để bắt đầu theo dõi và đọc truyện.",
};

export default function LoginApp() {
  return (
    <ClientLayout>
      <LoginPage />
    </ClientLayout>
  );
}
