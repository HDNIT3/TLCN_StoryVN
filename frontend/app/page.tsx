import ClientLayout from "@/modules/client/common/layouts/ClientLayout";
import HomePage from "@/modules/client/pages/HomePage";

export const metadata = {
  title: "StoryVN | Đọc truyện chữ trực tuyến chất lượng cao",
  description:
    "Đọc tiểu thuyết dịch, truyện convert, tiên hiệp, huyền huyễn, kiếm hiệp chất lượng cao, cập nhật chương mới mỗi ngày tại StoryVN.",
};

export default function HomeApp() {
  return (
    <ClientLayout>
      <HomePage />
    </ClientLayout>
  );
}
