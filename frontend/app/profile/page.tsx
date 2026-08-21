import ClientLayout from "@/modules/client/common/layouts/ClientLayout";
import ProfilePage from "@/modules/client/pages/ProfilePage";

export const metadata = {
  title: "Hồ sơ cá nhân | StoryVN",
  description: "Quản lý thông tin tài khoản, lịch sử đọc truyện và tủ sách cá nhân tại StoryVN.",
};

export default function ProfileApp() {
  return (
    <ClientLayout>
      <ProfilePage />
    </ClientLayout>
  );
}
