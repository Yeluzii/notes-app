import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Typography, Avatar, Space, Button, Modal } from 'antd';
import { useStore } from '@/store/userStore';
import { DeleteFilled } from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    Modal.confirm({
      title: '确定退出',
      content: '确认退出登录吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        logout();
        navigate('/login');
      },
    });
  };

  const selectedKeys = React.useMemo(() => {
    switch (location.pathname) {
      case '/':
        return ['home'];
      case '/notes':
        return ['notes'];
      case '/categories':
        return ['categories'];
      default:
        return [];
    }
  }, []);

  return (
    <Header>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <img
          src="/note-header.png"
          alt="Note Logo"
          style={{
            height: '32px',
            marginRight: '16px',
          }}
        />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={selectedKeys}
          style={{
            flex: 1,
          }}
          items={[
            {
              key: 'home',
              label: '首页',
              onClick: () => navigate('/'),
            },
            {
              key: 'notes',
              label: '笔记',
              onClick: () => navigate('/notes'),
            },
            {
              key: 'categories',
              label: '分类',
              onClick: () => navigate('/categories'),
            },
          ]}
        />

        <Space>
          {user ? (
            <>
              <Button
                icon={<DeleteFilled style={{ fontSize: '24px' }} />}
                onClick={() => navigate(`/notes/trash`)}
              />
              <Space size={'large'}>
                <Avatar src={user.avatar_url}></Avatar>
                <Text style={{ color: 'white' }}>{user.username}</Text>
              </Space>
              <Button type="primary" onClick={handleLogout}>
                退出
              </Button>
            </>
          ) : (
            <Button type="primary" onClick={() => navigate('/login')}>
              登录
            </Button>
          )}
        </Space>
      </div>
    </Header>
  );
};

export default Navbar;
