import "./index.less";
import "dayjs/locale/zh-cn";
import { App as AntdApp, ConfigProvider, theme } from "antd";
import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import dayjs from "dayjs";
import zhCN from "antd/locale/zh_CN";

dayjs.locale("zh-cn");
const root = document.getElementById("root"),
  { darkAlgorithm } = theme;

if (root) {
  createRoot(root).render(
    <AntdApp style={{ height: "100%", width: "100%" }}>
      <ConfigProvider locale={zhCN} theme={{ algorithm: darkAlgorithm }}>
        <App />
      </ConfigProvider>
    </AntdApp>
  );
}
