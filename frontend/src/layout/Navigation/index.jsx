import React, { useState } from "react";

import { Link } from "react-router-dom";
import { Layout, Menu, Typography } from "antd";
import { useSelector } from "react-redux";
import { selectCurrentAdmin } from "@/redux/auth/selectors";
import {
    SettingOutlined,
    UserOutlined,
    FileTextOutlined,
    DashboardOutlined,
    TeamOutlined,
    PaperClipOutlined
} from "@ant-design/icons";

const { Text } = Typography;
const { Sider } = Layout;

const whiteText = {
    color: '#ffffff',
    fontSize: '20px'
};
const colorWhite = {
    color: '#ffffff',
    fontSize: '13px'
};
const logoContainer = {
    display: 'flex',
    justifyContent: 'center'
};

function Navigation() {
    const [collapsed, setCollapsed] = useState(false);
    const user = useSelector(selectCurrentAdmin);
    const onCollapse = () => {
        setCollapsed(!collapsed);
    };
    return (
        <>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={onCollapse}
                style={{
                    zIndex: 1000,
                }}
            >
                <div className="logo" style={logoContainer}>
                    <Text style={whiteText}>Cryptocurrency</Text>
                </div>
                <div style={{ ...logoContainer, marginBottom: '10px' }}>
                    <Text style={colorWhite}>Welcome {user.name}</Text>
                </div>
                <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
                    <Menu.Item key="1" icon={<DashboardOutlined />}>
                        <Link to="/" />
                        Dashboard
                    </Menu.Item>
                    <Menu.Item key="2" icon={<UserOutlined />}>
                        <Link to="/profiles">Profiles</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<FileTextOutlined />}>
                        <Link to="/posts">Posts</Link>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<FileTextOutlined />}>
                        <Link to="/articles">Articles</Link>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<FileTextOutlined />}>
                        <Link to="/travelplans">Travelplans</Link>
                    </Menu.Item>
                    {user?.isSuperAdmin && <React.Fragment>
                        <Menu.Item key="6" icon={<TeamOutlined />}>
                            <Link to="/roles" />
                            Roles
                        </Menu.Item>
                        <Menu.Item key="7" icon={<TeamOutlined />}>
                            <Link to="/admins" />
                            Admins
                        </Menu.Item>
                    </React.Fragment>}
                    <Menu.Item key="8" icon={<SettingOutlined />}>
                        <Link to="/settings" />
                        Settings
                    </Menu.Item>
                    <Menu.Item key="9" icon={<PaperClipOutlined />}>
                        <Link to="/crypto" />
                        Crypto
                    </Menu.Item>
                    <Menu.Item key="10" icon={<PaperClipOutlined />}>
                        <Link to="/cryptohistory" />
                        CryptoHistory
                    </Menu.Item>
                    <Menu.SubMenu key="11" title="News" icon={<PaperClipOutlined />}>
                        <Menu.Item key="12" icon={<PaperClipOutlined />}>
                            <Link to="/newscategory" />
                            News Category
                        </Menu.Item>
                        <Menu.Item key="13" icon={<PaperClipOutlined />}>
                            <Link to="/news" />
                            News
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.Item key="14" icon={<PaperClipOutlined />}>
                        <Link to="/price" />
                        Price History
                    </Menu.Item>
                    <Menu.SubMenu key="15" title="Coin" icon={<PaperClipOutlined />}>
                        <Menu.Item key="16" icon={<PaperClipOutlined />}>
                            <Link to="/coindynamic" />
                            Dynamic
                        </Menu.Item>
                        <Menu.Item key="17" icon={<PaperClipOutlined />}>
                            <Link to="/coinstatic" />
                            Static
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.Item key="18" icon={<PaperClipOutlined />}>
                        <Link to="/error" />
                        Error
                    </Menu.Item>
                    <Menu.Item key="19" icon={<PaperClipOutlined />}>
                        <Link to="/contact" />
                        Contact
                    </Menu.Item>
                </Menu>
            </Sider>
        </>
    );
}

export default Navigation;
