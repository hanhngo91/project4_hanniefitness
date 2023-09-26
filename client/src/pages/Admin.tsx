import React, { useState } from "react";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import AdminUsers from "../components/AdminUsers";
import AdminNavbar from "../components/AdminNavbar";
import AdminClasses from "../components/AdminClasses";
import AdminCoaches from "../components/AdminCoaches";
import Reservations from "../components/AdminReservations";

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [showContent, setShowContent] = useState(1);

  return (
    <div className="h-screen">
      <AdminNavbar />
      <Layout className="mt-[3.4rem] h-screen">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <UserOutlined />,
                label: "Users",
                onClick: () => setShowContent(1),
              },
              {
                key: "2",
                icon: <Diversity3OutlinedIcon />,
                label: "Group Classes",
                onClick: () => setShowContent(2),
              },
              {
                key: "3",
                icon: <FitnessCenterOutlinedIcon />,
                label: "Coaches",
                onClick: () => setShowContent(3),
              },
              ,
              {
                key: "4",
                icon: <StickyNote2OutlinedIcon />,
                label: "Registrations",
                onClick: () => setShowContent(4),
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 500,
              background: colorBgContainer,
            }}
          >
            {showContent === 1 ? <AdminUsers /> : null}
            {showContent === 2 ? <AdminClasses /> : null}
            {showContent === 3 ? <AdminCoaches /> : null}
            {showContent === 4 ? <Reservations /> : null}
          </Content>
        </Layout>
      </Layout>
      <div className="w-screen h-10 flex justify-center my-[1.5rem] font-semibold">
        Hannie Fitness ©2023 Created by Hannie <FavoriteOutlinedIcon /> Hanh
      </div>
    </div>
  );
};

export default App;
